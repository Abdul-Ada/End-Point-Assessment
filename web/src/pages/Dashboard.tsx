import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Profile } from '../types'
import { Card } from '../components/ui/Card'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function Dashboard() {
  const [me, setMe] = useState<Profile | null>(null)
  const [entryCount, setEntryCount] = useState<number>(0)
  const [goalCount, setGoalCount] = useState<number>(0)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setMe(profile as Profile)
      const { count: ecount } = await supabase.from('diary_entries').select('*', { count: 'exact', head: true })
      const { count: gcount } = await supabase.from('smart_goals').select('*', { count: 'exact', head: true })
      setEntryCount(ecount || 0)
      setGoalCount(gcount || 0)
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome{me?.display_name ? `, ${me.display_name}` : ''}</h1>
          <p className="text-slate-500">Track your work, map KSBs, and hit your goals.</p>
        </div>
        <Link to="/entries/new"><Button>New Entry</Button></Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Entries</div>
          <div className="mt-2 text-3xl font-semibold">{entryCount}</div>
          <div className="mt-2 text-xs text-slate-500">Total diary entries</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Goals</div>
          <div className="mt-2 text-3xl font-semibold">{goalCount}</div>
          <div className="mt-2 text-xs text-slate-500">SMART goals created</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Status</div>
          <div className="mt-2 text-3xl font-semibold">{me?.role || '—'}</div>
          <div className="mt-2 text-xs text-slate-500">Your role</div>
        </Card>
      </div>
    </div>
  )
}