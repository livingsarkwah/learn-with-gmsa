import { useCallback, useEffect, useState } from 'react'
import { countCourses } from '../utils/data/courses'
import { countPrograms } from '../utils/data/programmes'
import { countResources } from '../utils/data/resources'

type CountState = {
  count: number
  loading: boolean
  error: string
  refetch: () => void
}

function useCount(loader: () => Promise<number>, dependencies: unknown[]): CountState {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const refetch = useCallback(() => setReload(value => value + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    loader()
      .then(value => {
        if (active) setCount(value)
      })
      .catch(() => {
        if (active) {
          setCount(0)
          setError('Unable to calculate this count right now.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
    // The domain identifiers are supplied by the caller and intentionally control this request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, reload])

  return { count, loading, error, refetch }
}

export function useCalculateNumberOfCourses(options: { programId?: string; collegeId?: string } = {}): CountState {
  return useCount(() => countCourses(options), [options.programId, options.collegeId])
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
  return useCount(() => countPrograms(options), [options.collegeId])
}

export function useCalculateNumberOfAllProgrammes(): CountState {
  return useCalculateNumberOfProgrammes()
}

export function useCalculateNumberOfProgrammesForCollege(collegeId?: string): CountState {
  return useCalculateNumberOfProgrammes({ collegeId })
}

export function useCalculateNumberOfResources(options: { programId?: string; collegeId?: string } = {}): CountState {
  return useCount(() => countResources(options), [options.programId, options.collegeId])
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
