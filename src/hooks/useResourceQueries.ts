import { useQuery } from '@tanstack/react-query'
import { getResourceById, getAdminResources, getResources } from '../utils/data/resources'

export const resourceQueryKeys = {
  all: ['resources'] as const,
  published: () => [...resourceQueryKeys.all, 'published'] as const,
  admin: () => [...resourceQueryKeys.all, 'admin'] as const,
  byId: (id: string) => [...resourceQueryKeys.all, 'by-id', id] as const,
}

export function useResources() {
  return useQuery({
    queryKey: resourceQueryKeys.published(),
    queryFn: getResources,
  })
}

export function useAdminResources() {
  return useQuery({
    queryKey: resourceQueryKeys.admin(),
    queryFn: getAdminResources,
  })
}

export function useResource(id: string | undefined) {
  return useQuery({
    queryKey: resourceQueryKeys.byId(id ?? ''),
    queryFn: () => getResourceById(id!),
    enabled: Boolean(id),
  })
}
