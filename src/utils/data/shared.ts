import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import { COLLEGES } from '../../constants/data'
import type { Database } from '../../lib/database.types'

export type Tables = Database['public']['Tables']

export type College = Tables['colleges']['Row']
export type Course = Tables['courses']['Row']
export type Program = Tables['programs']['Row']
export type ResourceCollection = Tables['resource_collections']['Row']
export type Category = Tables['categories']['Row']

export const RESOURCE_BUCKET = 'resources'

export interface AdminProgram {
  id: string | number
  name: string
  college: string
  collegeId?: string
  courseCount: number
}

export interface AdminCourse {
  id: string | number
  code: string
  title: string
  program: string
  programId?: string
  level: string
  semester: string
  resourceCount: number
}

export interface ResourceMutationInput {
  title: string
  description: string
  categoryId: string
  courseId: string
  collectionId: string
  resourceType: 'pdf' | 'video' | 'document'
  tags: string[]
  status: 'draft' | 'published'
}

export interface ProgramMutationInput {
  name: string
  collegeId: string
}

export interface CourseMutationInput {
  code: string
  title: string
  programId: string
  level: number
  semester: number
}

export function formatSemester(value: number) {
  return value === 1 ? 'First' : value === 2 ? 'Second' : String(value)
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

export async function getTableRows<TableName extends keyof Tables>(table: TableName) {
  if (!hasSupabaseConfig()) return [] as unknown as Tables[TableName]['Row'][]
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw error
  return data as Tables[TableName]['Row'][]
}

export function demoColleges(): College[] {
  return COLLEGES.map((name, index) => ({ id: `demo-college-${index + 1}`, name, created_at: '' }))
}

export function requireSupabaseConfig() {
  if (!hasSupabaseConfig()) throw new Error('Supabase is not configured for admin mutations.')
}

export function requireUuid(value: string, field: string) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidPattern.test(value)) throw new Error(`Invalid ${field}. Please reload the form and select it again.`)
  return value
}

export function storagePath(fileUrl: string) {
  return /^https?:\/\//i.test(fileUrl) ? null : fileUrl
}
