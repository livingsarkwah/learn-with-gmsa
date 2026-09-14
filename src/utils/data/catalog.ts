import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import { getTableRows, type Category, type ResourceCollection } from './shared'

export type { Category, ResourceCollection } from './shared'

export async function getResourceCollections(): Promise<ResourceCollection[]> {
  return getTableRows('resource_collections')
}

export async function getCategories(): Promise<Category[]> {
  return getTableRows('categories')
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
