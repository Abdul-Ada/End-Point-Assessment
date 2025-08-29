import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types'
import { LayoutDashboard, NotebookPen, Goal, ShieldCheck } from 'lucide-react'

function NavItem({ to, label, icon: Icon }: { to: string, label: string, icon: any }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900 ${active ? 'bg-slate-100 dark:bg-slate-900' : ''}`}>
      <Icon size={16} />
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const [me, setMe] = useState<Profile | null>(null)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setMe(data as Profile)
    })()
  }, [])

  return (
    <aside className="hidden w-64 flex-col gap-1 border-r border-border/60 p-3 md:flex">
      <NavItem to="/" label="Dashboard" icon={LayoutDashboard} />
      <NavItem to="/entries/new" label="New Entry" icon={NotebookPen} />
      <NavItem to="/goals" label="Goals" icon={Goal} />
      {me?.role === 'COACH' && <NavItem to="/coach" label="Coach" icon={ShieldCheck} />}
    </aside>
  )
}