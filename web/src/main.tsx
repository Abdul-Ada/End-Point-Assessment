import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewEntry from './pages/NewEntry'
import EntryView from './pages/EntryView'
import Goals from './pages/Goals'
import Coach from './pages/Coach'
import Calendar from './pages/Calendar' // Import the new Calendar page
import './index.css'

// This component protects routes that require a user to be logged in.
function RequireAuth({ children }: { children: JSX.Element }) {
  const [session, setSession] = React.useState<import('@supabase/supabase-js').Session | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    // You can replace this with a more sophisticated loading spinner component
    return <div>Loading session...</div>
  }
  
  // If there's no session, redirect the user to the login page
  return session ? children : <Navigate to="/login" replace />
}

// Render the application
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><App /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="entries/new" element={<NewEntry />} />
          <Route path="entries/:id" element={<EntryView />} />
          <Route path="goals" element={<Goals />} />
          <Route path="calendar" element={<Calendar />} /> {/* Add the new Calendar route */}
          <Route path="coach" element={<Coach />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

