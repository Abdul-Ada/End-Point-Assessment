import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { cn } from './ui/cn'
import { Profile } from '../types'
import {
  LayoutDashboard,
  User,
  CheckCircle2,
  Flag,
  CalendarDays, // 1. Import the new icon
} from 'lucide-react'

// Array of navigation links for apprentices
const apprenticeLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', icon: Flag },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays }, // 2. Add the new calendar link object
]

// Array of navigation links for coaches
const coachLinks = [
  { href: '/coach', label: 'Coach View', icon: User },
  { href: '/goals', label: 'My Goals', icon: Flag },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data as Profile)
      }
    }
    getProfile()
  }, [])

  const links = profile?.role === 'COACH' ? coachLinks : apprenticeLinks

  return (
    <aside className="hidden w-56 flex-col gap-1 md:flex">
      <h2 className="px-4 text-lg font-semibold tracking-tight">Menu</h2>
      {links.map(link => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100',
            pathname === link.href && 'bg-slate-200 text-slate-900'
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
      {/* Conditionally render the Coach link if the user has the COACH role */}
      {profile?.role === 'COACH' && (
         <Link
          to="/coach"
          className={cn(
            'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100',
            pathname === '/coach' && 'bg-slate-200 text-slate-900'
          )}
        >
          <User className="h-4 w-4" />
          Coach View
        </Link>
      )}
    </aside>
  )
}
