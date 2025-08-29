
import { supabase } from './supabaseClient'

export async function submitEntry(id: string) {
  const { error } = await supabase.rpc('submit_entry', { p_entry_id: id })
  if (error) throw error
}

export async function approveEntry(id: string) {
  const { error } = await supabase.rpc('approve_entry', { p_entry_id: id })
  if (error) throw error
}
