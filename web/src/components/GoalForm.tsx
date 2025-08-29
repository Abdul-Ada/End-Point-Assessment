import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function GoalForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', start_date: new Date().toISOString().slice(0,10),
    target_date: new Date(Date.now() + 28*864e5).toISOString().slice(0,10),
    measure: '', relevant_ksbs: ''
  })

  async function save() {
    const { error } = await supabase.from('smart_goals').insert({
      title: form.title,
      description: form.description,
      start_date: form.start_date,
      target_date: form.target_date,
      measure: form.measure,
      relevant_ksbs: form.relevant_ksbs.split(',').map(s => s.trim())
    })
    if (error) alert(error.message); else onSaved?.()
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
      <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      <div>
        <label>Start</label>
        <input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} />
      </div>
      <div>
        <label>Target</label>
        <input type="date" value={form.target_date} onChange={e=>setForm({...form, target_date:e.target.value})} />
      </div>
      <input placeholder="Measure" value={form.measure} onChange={e=>setForm({...form, measure:e.target.value})} />
      <input placeholder="Relevant KSBs (comma separated)" value={form.relevant_ksbs} onChange={e=>setForm({...form, relevant_ksbs:e.target.value})} />
      <button onClick={save}>Save Goal</button>
    </div>
  )
}