import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { countCourses } from '../utils/data/courses'
import { countPrograms } from '../utils/data/programmes'
import { countResources } from '../utils/data/resources'

type CountState = {
  count: number
  loading: boolean
  error: string
  refetch: () => void
}

function useCount(loader: () => Promise<number>, queryKey: readonly unknown[]): CountState {
  const query = useQuery({ queryKey, queryFn: loader })
  const refetch = useCallback(() => { void query.refetch() }, [query])

  return {
    count: query.data ?? 0,
    loading: query.isPending,
    error: query.error ? 'Unable to calculate this count right now.' : '',
    refetch,
  }
}

export function useCalculateNumberOfCourses(options: { programId?: string; collegeId?: string } = {}): CountState {
  return useCount(() => countCourses(options), ['counts', 'courses', options.programId, options.collegeId])
}

export function useCalculateNumberOfAllCourses(): CountState {
  return useCalculateNumberOfCourses()
}

export function useCalculateNumberOfCoursesForProgram(programId?: string): CountState {
  return useCalculateNumberOfCourses({ programId })
}

export function useCalculateNumberOfCoursesForCollege(collegeId?: string): CountState {
  return useCalculateNumberOfCourses({ collegeId })
}

export function useCalculateNumberOfProgrammes(options: { collegeId?: string } = {}): CountState {
  return useCount(() => countPrograms(options), ['counts', 'programs', options.collegeId])
}

export function useCalculateNumberOfAllProgrammes(): CountState {
  return useCalculateNumberOfProgrammes()
}

export function useCalculateNumberOfProgrammesForCollege(collegeId?: string): CountState {
  return useCalculateNumberOfProgrammes({ collegeId })
}

export function useCalculateNumberOfResources(options: { programId?: string; collegeId?: string } = {}): CountState {
  return useCount(() => countResources(options), ['counts', 'resources', options.programId, options.collegeId])
}

export function useCalculateNumberOfAllResources(): CountState {
  return useCalculateNumberOfResources()
}

export function useCalculateNumberOfResourcesForProgram(programId?: string): CountState {
  return useCalculateNumberOfResources({ programId })
}

export function useCalculateNumberOfResourcesForCollege(collegeId?: string): CountState {
  return useCalculateNumberOfResources({ collegeId })
}
