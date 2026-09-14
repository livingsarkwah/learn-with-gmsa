import { ADMIN_COURSES, ADMIN_PROGRAMS } from '../../constants/data'
import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import {
  formatSemester,
  demoColleges,
  getTableRows,
  type AdminCourse,
  type Course,
  type CourseMutationInput,
  requireSupabaseConfig,
} from './shared'

export type { AdminCourse, Course, CourseMutationInput } from './shared'

function mapAdminCourse(course: { id: string | number; code: string; title: string; level: number | string; semester: number | string; program_id?: string; program?: { name: string } | null }): AdminCourse {
  return {
    id: course.id,
    code: course.code,
    title: course.title,
    program: course.program?.name ?? 'Unassigned',
    programId: course.program_id,
    level: String(course.level),
    semester: typeof course.semester === 'number' ? formatSemester(course.semester) : course.semester,
    resourceCount: 0,
  }
}

export async function getCourses(): Promise<Course[]> {
  return getTableRows('courses')
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!hasSupabaseConfig()) return null
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getAdminCourses(): Promise<AdminCourse[]> {
  if (!hasSupabaseConfig()) return [...ADMIN_COURSES]
  const { data, error } = await supabase.from('courses').select('id, code, title, level, semester, program_id, program:programs(name)').order('code')
  if (error) throw error
  return (data as unknown as Array<Parameters<typeof mapAdminCourse>[0]>).map(mapAdminCourse)
}

export async function getCoursesByProgramId(programId: string): Promise<AdminCourse[]> {
  if (!hasSupabaseConfig()) {
    const program = ADMIN_PROGRAMS.find(item => String(item.id) === String(programId))
    return program
      ? ADMIN_COURSES.filter(course => course.program === program.name) as AdminCourse[]
      : []
  }
  const { data, error } = await supabase.from('courses').select('id, code, title, level, semester, program_id, program:programs(name)').eq('program_id', programId).order('code')
  if (error) throw error
  return (data as unknown as Array<Parameters<typeof mapAdminCourse>[0]>).map(mapAdminCourse)
}

export async function createCourse(input: CourseMutationInput) {
  requireSupabaseConfig()
  const { error } = await supabase.from('courses').insert({ code: input.code, title: input.title, program_id: input.programId, level: input.level, semester: input.semester } as never)
  if (error) throw error
}

export async function updateCourse(id: string, input: CourseMutationInput) {
  requireSupabaseConfig()
  const { error } = await supabase.from('courses').update({ code: input.code, title: input.title, program_id: input.programId, level: input.level, semester: input.semester } as never).eq('id', id)
  if (error) throw error
}

export async function deleteCourse(id: string) {
  requireSupabaseConfig()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}

export async function countCourses(options: { programId?: string; collegeId?: string } = {}) {
  if (!hasSupabaseConfig()) {
    const collegeName = options.collegeId
      ? demoColleges().find(college => college.id === options.collegeId)?.name
      : undefined
    if (collegeName) {
      const programNames = ADMIN_PROGRAMS.filter(program => program.college === collegeName).map(program => program.name)
      return ADMIN_COURSES.filter(course => programNames.includes(course.program)).length
    }
    return ADMIN_COURSES.filter(course => !options.programId || String(course.program) === options.programId).length
  }
  if (options.collegeId) {
    const { count, error } = await supabase.from('courses').select('id, programs!inner(college_id)', { count: 'exact', head: true }).eq('programs.college_id', options.collegeId)
    if (error) throw error
    return count ?? 0
  }
  let query = supabase.from('courses').select('id', { count: 'exact', head: true })
  if (options.programId) query = query.eq('program_id', options.programId)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}
