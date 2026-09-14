import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { ADMIN_COURSES, ADMIN_PROGRAMS, ALL_RESOURCES } from '../constants/data'
import type { Database } from '../lib/database.types'
import type { Resource } from '../types'

type Tables = Database['public']['Tables']

export type College = Tables['colleges']['Row']
export type Course = Tables['courses']['Row']
export type Program = Tables['programs']['Row']
export type ResourceCollection = Tables['resource_collections']['Row']
export type Category = Tables['categories']['Row']

export interface AdminProgram {
  id: string | number
  name: string
  college: string
  courseCount: number
}

export interface AdminCourse {
  id: string | number
  code: string
  title: string
  program: string
  level: string
  semester: string
  resourceCount: number
}

export function normalizeAcademicLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(bsc|ba|bfa|bed|llb|od|pharmd|doctorof)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
}

export function academicLabelsMatch(left: string, right: string) {
  const normalizedLeft = normalizeAcademicLabel(left)
  const normalizedRight = normalizeAcademicLabel(right)
  return normalizedLeft === normalizedRight
    || normalizedLeft.includes(normalizedRight)
    || normalizedRight.includes(normalizedLeft)
}

function formatSemester(value: number) {
  return value === 1 ? 'First' : value === 2 ? 'Second' : String(value)
}

function mapResource(
  row: Tables['resources']['Row'],
  course: Course | null,
  program: Program | null,
  college: College | null,
  collection: ResourceCollection | null,
  category: Category | null,
): Resource {
  const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(row.file_url)
  const type: Resource['type'] = isYouTube
    ? 'Video'
    : row.resource_type.toLowerCase() === 'pdf'
      ? 'PDF'
      : 'Document'

  return {
    id: row.id,
    title: row.title,
    courseCode: course?.code ?? 'General',
    courseTitle: course?.title ?? '',
    college: college?.name,
    program: program?.name ?? '',
    collection: collection?.name ?? '',
    type,
    downloads: row.download_count,
    views: 0,
    tags: row.tags ?? [],
    description: row.description ?? '',
    level: course ? String(course.level) : '',
    semester: course ? formatSemester(course.semester) : '',
    uploadDate: row.created_at,
    status: 'published',
    fileUrl: row.file_url,
    fileName: row.file_name,
    memberOnly: category?.member_only ?? false,
  }
}

async function getResourceRelations(row: Tables['resources']['Row']) {
  const [course, collection, category] = await Promise.all([
    row.course_id ? getCourseById(row.course_id) : Promise.resolve(null),
    row.collection_id ? getResourceCollectionById(row.collection_id) : Promise.resolve(null),
    getCategoryById(row.category_id),
  ])
  const program = course?.program_id ? await getProgramById(course.program_id) : null
  const college = program?.college_id ? await getCollegeById(program.college_id) : null
  return { course, program, college, collection, category }
}

async function getTableRows<TableName extends keyof Tables>(table: TableName) {
  if (!hasSupabaseConfig()) {
    return [] as Awaited<ReturnType<typeof supabase.from>>['data']
  }

  const { data, error } = await supabase.from(table).select('*')

  if (error) {
    throw error
  }

  return data
}

export async function getColleges(): Promise<College[]> {
  return getTableRows('colleges') as Promise<College[]>
}

export async function getCourses(): Promise<Course[]> {
  return getTableRows('courses') as Promise<Course[]>
}

export async function getPrograms(): Promise<Program[]> {
  return getTableRows('programs') as Promise<Program[]>
}

export async function getResourceCollections(): Promise<ResourceCollection[]> {
  return getTableRows('resource_collections') as Promise<ResourceCollection[]>
}

export async function getCategories(): Promise<Category[]> {
  return getTableRows('categories') as Promise<Category[]>
}

export async function getAdminPrograms(): Promise<AdminProgram[]> {
  if (!hasSupabaseConfig()) return [...ADMIN_PROGRAMS]

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('name')

  if (error) throw error

  const programs = data as unknown as Array<{
  id: string;
  name: string;
  college_id: string;
}>;

return await Promise.all(
  programs.map(async (program) => ({
    id: program.id,
    name: program.name,
    college: (await getCollegeById(program.college_id))?.name ?? "unassigned",
    courseCount: 0,
  }))
);

}

export async function getAdminCourses(): Promise<AdminCourse[]> {
  if (!hasSupabaseConfig()) return [...ADMIN_COURSES]

  const { data, error } = await supabase
    .from('courses')
    .select('id, code, title, level, semester, program:programs(name)')
    .order('code')

  if (error) throw error

  return (data as unknown as Array<{
    id: string
    code: string
    title: string
    level: number
    semester: number
    program: { name: string } | null
  }>).map(course => ({
    id: course.id,
    code: course.code,
    title: course.title,
    program: course.program?.name ?? 'Unassigned',
    level: String(course.level),
    semester: formatSemester(course.semester),
    resourceCount: 0,
  }))
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!hasSupabaseConfig()) return null

  const { data, error } = await supabase.from('courses').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getProgramById(id: string): Promise<Program | null> {
  if (!hasSupabaseConfig()) return null

  const { data, error } = await supabase.from('programs').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getCollegeById(id: string): Promise<College | null> {
  if (!hasSupabaseConfig()) return null

  const { data, error } = await supabase.from('colleges').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getResourceCollectionById(id: string): Promise<ResourceCollection | null> {
  if (!hasSupabaseConfig()) return null

  const { data, error } = await supabase.from('resource_collections').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!hasSupabaseConfig()) return null

  const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getResources(): Promise<Resource[]> {
  if (!hasSupabaseConfig()) {
    return [...ALL_RESOURCES]
  }

  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (error) throw error

  return Promise.all(data.map(async row => {
    const relations = await getResourceRelations(row)
    return mapResource(row, relations.course, relations.program, relations.college, relations.collection, relations.category)
  }))
}

export async function getResourceById(id: string): Promise<Resource | null> {
  if (!hasSupabaseConfig()) {
    return ALL_RESOURCES.find(resource => String(resource.id) === String(id)) ?? null
  }

  const { data, error } = await supabase.from('resources').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null

  const relations = await getResourceRelations(data)
  return mapResource(data, relations.course, relations.program, relations.college, relations.collection, relations.category)
}

