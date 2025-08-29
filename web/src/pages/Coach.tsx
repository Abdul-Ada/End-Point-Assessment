import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EntryList from '../components/EntryList'
import { Profile } from '../types'

export default function Coach() {
  const [me, setMe] = useState<Profile | null>(null)
  const [apprentices, setApprentices] = useState<Profile[]>([])
  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setMe(profile as Profile)
      if ((profile as Profile)?.role === 'COACH') {
        const { data } = await supabase
          .from('coach_assignments')
          .select('apprentice_id, profiles!coach_assignments_apprentice_id_fkey(*)')
        const unique: Record<string, Profile> = {}
        ;(data||[]).forEach((r: any) => { unique[r.apprentice_id] = r.profiles })
        setApprentices(Object.values(unique))
      }
    }
    load()
  }, [])

  if (me?.role !== 'COACH') return <div>Coach-only area.</div>

  return (
    <div>
      <h1>Coach Dashboard</h1>
      <label>Apprentice: </label>
      <select value={selected} onChange={e=>setSelected(e.target.value)}>
        <option value="">-- choose --</option>
        {apprentices.map(a => <option key={a.id} value={a.id}>{a.display_name || a.email}</option>)}
      </select>

      {selected && (
        <div style={{ marginTop: 16 }}>
          <h2>Entries</h2>
          <EntryList userId={selected} />
        </div>
      )}
    </div>
  )
}
