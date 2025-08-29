import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import GoalForm from '../components/GoalForm'
import { SmartGoal } from '../types'

export default function Goals() {
  const [goals, setGoals] = useState<SmartGoal[]>([])
  async function load() {
    const { data, error } = await supabase.from('smart_goals').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setGoals(data as SmartGoal[])
  }
  useEffect(()=>{ load() }, [])

  return (
    <div>
      <h1>SMART Goals</h1>
      <GoalForm onSaved={load} />
      <h2>Your Goals</h2>
      <ul>
        {goals.map(g => (
          <li key={g.id}>
            <strong>{g.title}</strong> — {g.measure} (to {g.target_date})
          </li>
        ))}
      </ul>
    </div>
  )
}