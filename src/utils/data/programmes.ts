import { ADMIN_PROGRAMS } from '../../constants/data'
import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import { countCourses } from './courses'
import {
  demoColleges,
  getTableRows,
  type College,
  type Program,
  type AdminProgram,
  type ProgramMutationInput,
  requireSupabaseConfig,
} from './shared'

export type { AdminProgram, College, Program, ProgramMutationInput } from './shared'

export async function getColleges(): Promise<College[]> {
  if (!hasSupabaseConfig()) return demoColleges()
  const colleges = await getTableRows('colleges')
  return colleges.length > 0 ? colleges : demoColleges()
}

export async function getPrograms(): Promise<Program[]> {
  return getTableRows('programs')
}

export async function getProgramById(id: string): Promise<Program | null> {
  if (!hasSupabaseConfig()) return null
  const { data, error } = await supabase.from('programs').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function getAdminPrograms(): Promise<AdminProgram[]> {
  if (!hasSupabaseConfig()) return [...ADMIN_PROGRAMS]
  const { data, error } = await supabase.from('programs').select('*').order('name')
  if (error) throw error

  return Promise.all((data as Array<{ id: string; name: string; college_id: string }>).map(async program => {
    const [college, courseCount] = await Promise.all([
      getCollegeById(program.college_id),
      countCourses({ programId: program.id }),
    ])

    return {
      id: program.id,
      name: program.name,
      college: college?.name ?? 'unassigned',
      collegeId: program.college_id,
      courseCount,
    }
  }))
}

export async function getCollegeById(id: string): Promise<College | null> {
  if (!hasSupabaseConfig()) return null
  const { data, error } = await supabase.from('colleges').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function createProgram(input: ProgramMutationInput) {
  requireSupabaseConfig()
  const { error } = await supabase.from('programs').insert({ name: input.name, college_id: input.collegeId } as never)
  if (error) throw error
}

export async function updateProgram(id: string, input: ProgramMutationInput) {
  requireSupabaseConfig()
  const { error } = await supabase.from('programs').update({ name: input.name, college_id: input.collegeId } as never).eq('id', id)
  if (error) throw error
}

export async function deleteProgram(id: string) {
  requireSupabaseConfig()
  const { count, error: countError } = await supabase.from('courses').select('id', { count: 'exact', head: true }).eq('program_id', id)
  if (countError) throw countError
  if (count) throw new Error('Cannot delete a program that still has courses.')
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) throw error
}

export async function countPrograms(options: { collegeId?: string } = {}) {
  if (!hasSupabaseConfig()) {
    const collegeName = options.collegeId
      ? demoColleges().find(college => college.id === options.collegeId)?.name
      : undefined
    const programs = ADMIN_PROGRAMS.filter(program => !collegeName || program.college === collegeName)
    return programs.length
  }
  let query = supabase.from('programs').select('id', { count: 'exact', head: true })
  if (options.collegeId) query = query.eq('college_id', options.collegeId)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}
