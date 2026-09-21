import { ADMIN_PROGRAMS, ALL_RESOURCES } from '../../constants/data'
import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import type { Resource } from '../../types'
import {
  getCategoryById,
  getCollegeById,
  getProgramById,
} from './programmeRelations'
import { getCourseById } from './courses'
import { getResourceCollectionById } from './catalog'
import {
  RESOURCE_BUCKET,
  getTableRows,
  type Category,
  type College,
  type Course,
  type Program,
  type ResourceCollection,
  type ResourceMutationInput,
  requireSupabaseConfig,
  requireUuid,
  storagePath,
} from './shared'

async function resolveResourceFileUrl(filePath: string) {
  if (!hasSupabaseConfig() || /^https?:\/\//i.test(filePath)) return filePath
  const { data, error } = await supabase.storage.from(RESOURCE_BUCKET).createSignedUrl(filePath, 3600)
  return error ? filePath : data.signedUrl
}

function storageFilePath(file: File) {
  const extension = file.name.match(/\.[^./\\]+$/)?.[0] ?? ''
  return `${crypto.randomUUID()}${extension.toLowerCase()}`
}

async function mapResource(row: import('./shared').Tables['resources']['Row'], course: Course | null, program: Program | null, college: College | null, collection: ResourceCollection | null, category: Category | null): Promise<Resource> {
  const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(row.file_url)
  return {
    id: row.id,
    title: row.title,
    courseCode: course?.code ?? 'General',
    courseTitle: course?.title ?? '',
    college: college?.name,
    program: program?.name ?? '',
    collection: collection?.name ?? '',
    type: isYouTube ? 'Video' : row.resource_type.toLowerCase() === 'pdf' ? 'PDF' : 'Document',
    downloads: row.resource_type.toLowerCase() === 'video' ? 0 : row.download_count,
    views: 0,
    tags: row.tags ?? [],
    description: row.description ?? '',
    level: course ? String(course.level) : '',
    semester: course ? (course.semester === 1 ? 'First' : course.semester === 2 ? 'Second' : String(course.semester)) : '',
    uploadDate: row.created_at,
    status: row.status as Resource['status'],
    fileUrl: await resolveResourceFileUrl(row.file_url),
    fileName: row.file_name,
    memberOnly: category?.member_only ?? false,
  }
}

async function mapRows(rows: import('./shared').Tables['resources']['Row'][]) {
  const courses: Course[] = await getTableRows('courses')
  const categories: Category[] = await getTableRows('categories')
  const collections: ResourceCollection[] = await getTableRows('resource_collections')

  const courseIds = new Set(rows.flatMap(row => row.course_id ? [row.course_id] : []))
  const categoryIds = new Set(rows.map(row => row.category_id))
  const collectionIds = new Set(rows.flatMap(row => row.collection_id ? [row.collection_id] : []))
  const courseRows = courses.filter(course => courseIds.has(course.id))
  const categoryRows = categories.filter(category => categoryIds.has(category.id))
  const collectionRows = collections.filter(collection => collectionIds.has(collection.id))
  const courseById = new Map(courseRows.map(course => [course.id, course]))
  const categoryById = new Map(categoryRows.map(category => [category.id, category]))
  const collectionById = new Map(collectionRows.map(collection => [collection.id, collection]))
  const programIds = new Set(courseRows.flatMap(course => course.program_id ? [course.program_id] : []))
  const allPrograms: Program[] = await getTableRows('programs')
  const programRows = allPrograms.filter(program => programIds.has(program.id))
  const programById = new Map(programRows.map(program => [program.id, program]))
  const collegeIds = new Set(programRows.flatMap(program => program.college_id ? [program.college_id] : []))
  const allColleges: College[] = await getTableRows('colleges')
  const collegeRows = allColleges.filter(college => collegeIds.has(college.id))
  const collegeById = new Map(collegeRows.map(college => [college.id, college]))

  return Promise.all(rows.map(async row => {
    const course = row.course_id ? courseById.get(row.course_id) ?? null : null
    const program = course?.program_id ? programById.get(course.program_id) ?? null : null
    const college = program?.college_id ? collegeById.get(program.college_id) ?? null : null
    const collection = row.collection_id ? collectionById.get(row.collection_id) ?? null : null
    const category = categoryById.get(row.category_id) ?? null
    return mapResource(row, course, program, college, collection, category)
  }))
}

export async function getResources(): Promise<Resource[]> {
  if (!hasSupabaseConfig()) return [...ALL_RESOURCES]
  const { data, error } = await supabase.from('resources').select('*').eq('status', 'published').order('created_at', { ascending: false })
  if (error) throw error
  return mapRows(data)
}

export async function getAdminResources(): Promise<Resource[]> {
  if (!hasSupabaseConfig()) return [...ALL_RESOURCES]
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return mapRows(data)
}

export async function getResourceById(id: string): Promise<Resource | null> {
  if (!hasSupabaseConfig()) return ALL_RESOURCES.find(resource => String(resource.id) === id) ?? null
  const { data, error } = await supabase.from('resources').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const [resource] = await mapRows([data])
  return resource ?? null
}

export async function incrementDownloadCount(id: string | number) {
  if (!hasSupabaseConfig()) return
  await supabase.rpc('increment_resource_download', { resource_id: String(id) } as never)
}

export async function createAdminResource(source: File | string, input: ResourceMutationInput) {
  requireSupabaseConfig()
  const categoryId = requireUuid(input.categoryId, 'category')
  const courseId = requireUuid(input.courseId, 'course')
  const collectionId = requireUuid(input.collectionId, 'collection')
  const isExternalResource = typeof source === 'string'
  const filePath = isExternalResource ? source : storageFilePath(source)
  if (isExternalResource && !/^https?:\/\/\S+$/i.test(source)) {
    throw new Error('Enter a valid HTTP or HTTPS video link.')
  }
  if (!isExternalResource) {
    const upload = await supabase.storage.from(RESOURCE_BUCKET).upload(filePath, source, { contentType: source.type, upsert: false })
    if (upload.error) throw upload.error
  }
  const payload = { title: input.title, description: input.description || null, category_id: categoryId, course_id: courseId, collection_id: collectionId, resource_type: input.resourceType, file_url: filePath, file_name: isExternalResource ? null : source.name, tags: input.tags, status: input.status }
  const { data, error } = await supabase.from('resources').insert(payload as never).select('id').single()
  if (error) {
    if (!isExternalResource) await supabase.storage.from(RESOURCE_BUCKET).remove([filePath])
    throw error
  }
  return (data as unknown as { id: string }).id
}

export async function updateAdminResource(id: string, input: Partial<ResourceMutationInput>) {
  requireSupabaseConfig()
  const update: Record<string, unknown> = {}
  if (input.title !== undefined) update.title = input.title
  if (input.description !== undefined) update.description = input.description || null
  if (input.categoryId !== undefined) update.category_id = requireUuid(input.categoryId, 'category')
  if (input.courseId !== undefined) update.course_id = requireUuid(input.courseId, 'course')
  if (input.collectionId !== undefined) update.collection_id = requireUuid(input.collectionId, 'collection')
  if (input.resourceType !== undefined) update.resource_type = input.resourceType
  if (input.tags !== undefined) update.tags = input.tags
  if (input.status !== undefined) update.status = input.status
  const { error } = await supabase.from('resources').update(update as never).eq('id', id)
  if (error) throw error
}

export async function replaceAdminResourceFile(id: string, file: File) {
  requireSupabaseConfig()
  const current = await supabase.from('resources').select('file_url').eq('id', id).single()
  if (current.error) throw current.error
  const path = storageFilePath(file)
  const upload = await supabase.storage.from(RESOURCE_BUCKET).upload(path, file, { contentType: file.type, upsert: false })
  if (upload.error) throw upload.error
  const { error } = await supabase.from('resources').update({ file_url: path, file_name: file.name } as never).eq('id', id)
  if (error) {
    await supabase.storage.from(RESOURCE_BUCKET).remove([path])
    throw error
  }
  const oldPath = storagePath((current.data as unknown as { file_url: string }).file_url)
  if (oldPath) await supabase.storage.from(RESOURCE_BUCKET).remove([oldPath])
}

export async function replaceAdminResourceLink(id: string, url: string) {
  requireSupabaseConfig()
  if (!/^https?:\/\/\S+$/i.test(url)) throw new Error('Enter a valid HTTP or HTTPS video link.')
  const current = await supabase.from('resources').select('file_url').eq('id', id).single()
  if (current.error) throw current.error
  const { error } = await supabase.from('resources').update({ file_url: url, file_name: null, resource_type: 'video' } as never).eq('id', id)
  if (error) throw error
  const oldPath = storagePath((current.data as unknown as { file_url: string }).file_url)
  if (oldPath) await supabase.storage.from(RESOURCE_BUCKET).remove([oldPath])
}

export async function deleteAdminResource(id: string) {
  requireSupabaseConfig()
  const current = await supabase.from('resources').select('file_url').eq('id', id).single()
  if (current.error) throw current.error
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw error
  const oldPath = storagePath((current.data as unknown as { file_url: string }).file_url)
  if (oldPath) await supabase.storage.from(RESOURCE_BUCKET).remove([oldPath])
}

export async function countResources(options: { programId?: string; collegeId?: string } = {}) {
  if (!hasSupabaseConfig()) {
    const programName = options.programId
      ? ADMIN_PROGRAMS.find(program => String(program.id) === options.programId)?.name
      : undefined
    const collegeProgramNames = options.collegeId
      ? ADMIN_PROGRAMS.filter(program => program.college === options.collegeId).map(program => program.name)
      : undefined
    return ALL_RESOURCES.filter(resource => {
      if (programName && resource.program !== programName) return false
      if (collegeProgramNames && !collegeProgramNames.includes(resource.program)) return false
      return true
    }).length
  }
  let query = supabase.from('resources').select('id, courses!inner(program_id, programs!inner(college_id))', { count: 'exact', head: true }).eq('status', 'published')
  if (options.programId) query = query.eq('courses.program_id', options.programId)
  if (options.collegeId) query = query.eq('courses.programs.college_id', options.collegeId)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}
