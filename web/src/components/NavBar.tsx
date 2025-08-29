import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function NavBar() {
  const nav = useNavigate()
  async function logout() {
    await supabase.auth.signOut()
    nav('/login')
  }
  return (
    <header style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/entries/new">New Entry</Link>
      <Link to="/goals">Goals</Link>
      <Link to="/coach">Coach</Link>
      <div style={{ marginLeft: 'auto' }}>
        <button onClick={logout}>Sign out</button>
      </div>
    </header>
  )
}