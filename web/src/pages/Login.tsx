import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [busy, setBusy] = useState(false)

  // NEW: message + resend states so we don't crash
  const [msg, setMsg] = useState('')
  const [canResend, setCanResend] = useState(false)

  // If already authenticated, bounce to home once
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav('/', { replace: true })
    })
  }, [nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    setCanResend(false)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin } // http://localhost:5173
        })
        if (error) throw error

        // If email confirmation is ON, Supabase won't create a session yet
        if (!data.session) {
          setMsg('Account created. Please check your email to confirm before signing in.')
          setCanResend(true)
          return
        }
        // If confirmations are OFF, you'll have a session already:
        nav('/', { replace: true })
        return
      }

      // Sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // Nice message if email confirmation is required
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          setMsg('Please confirm your email before signing in.')
          setCanResend(true)
          return
        }
        throw error
      }
      nav('/', { replace: true })
    } catch (err: any) {
      console.error('auth error', err)
      alert(err?.message || 'Auth failed')
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) alert(error.message)
    else alert('Confirmation email sent.')
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto' }}>
      <h1>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>

      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <button
        onClick={() => { setMode(m => (m === 'signin' ? 'signup' : 'signin')); setMsg(''); setCanResend(false)}}
        style={{ marginTop: 8 }}
      >
        {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </button>

      {msg && (
        <p style={{ marginTop: 12 }}>
          {msg} {canResend && <button onClick={resend} style={{ marginLeft: 8 }}>Resend email</button>}
        </p>
      )}
    </div>
  )
}
