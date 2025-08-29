import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DiaryEntry } from '../types'
import { Link } from 'react-router-dom'

export default function EntryList({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    async function load() {
      const q = supabase.from('diary_entries').select('*').order('date', { ascending: false })
      const { data, error } = userId ? await q.eq('user_id', userId) : await q
      if (error) throw error
      setEntries(data as DiaryEntry[])
    }
    load()
  }, [userId])

  return (
    <ul>
      {entries.map(e => (
        <li key={e.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          <Link to={`/entries/${e.id}`}>{e.date} — {e.title} [{e.status}]</Link>
        </li>
      ))}
    </ul>
  )
}