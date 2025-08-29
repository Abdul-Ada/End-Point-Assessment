import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/80 backdrop-blur dark:bg-slate-950/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <div className="font-semibold">Apprenticeship Tracker</div>
        <div className="ml-auto flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-white hover:shadow dark:bg-slate-900">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}