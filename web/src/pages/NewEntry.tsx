import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function NewEntry() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    title: '', body: '', minutes_spent: 30, ksb_tags: '', evidence_urls: ''
  })
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    const { error } = await supabase.from('diary_entries').insert({
      date: form.date,
      title: form.title,
      body: form.body,
      minutes_spent: Number(form.minutes_spent),
      ksb_tags: form.ksb_tags.split(',').map(s=>s.trim()).filter(Boolean),
      evidence_urls: form.evidence_urls.split(',').map(s=>s.trim()).filter(Boolean)
    })
    setBusy(false)
    if (error) alert(error.message); else nav('/')
  }

  return (
    <Card className="max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold">New Diary Entry</h1>
      <div className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm text-slate-600">Date</label>
          <Input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600">Title</label>
          <Input placeholder="E.g. Built RBAC for logs" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600">What did you do?</label>
          <Textarea placeholder="Describe the task, tools, outcomes, and link to evidence." value={form.body} onChange={e=>setForm({...form, body:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Minutes</label>
            <Input type="number" value={form.minutes_spent} onChange={e=>setForm({...form, minutes_spent:Number(e.target.value)})} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">KSB tags (comma)</label>
            <Input placeholder="SD1, SD3" value={form.ksb_tags} onChange={e=>setForm({...form, ksb_tags:e.target.value})} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600">Evidence URLs (comma)</label>
          <Input placeholder="https://..." value={form.evidence_urls} onChange={e=>setForm({...form, evidence_urls:e.target.value})} />
        </div>
        <div className="flex gap-3">
          <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save entry'}</Button>
          <Button variant="outline" onClick={()=>nav(-1)}>Cancel</Button>
        </div>
      </div>
    </Card>
  )
}