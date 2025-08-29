import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { DiaryEntry, Comment, Profile } from '../types'
import { approveEntry, submitEntry } from '../lib/rpc'

export default function EntryView() {
  const { id } = useParams()
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [me, setMe] = useState<Profile | null>(null)
  const [newComment, setNewComment] = useState('')

  async function load() {
    const { data: e } = await supabase.from('diary_entries').select('*').eq('id', id).single()
    setEntry(e as DiaryEntry)
    const { data: cs } = await supabase.from('comments').select('*').eq('entry_id', id).order('created_at', { ascending: true })
    setComments((cs || []) as Comment[])
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setMe(data as Profile)
    }
  }

  useEffect(() => { load() }, [id])

  async function addComment() {
    const { error } = await supabase.from('comments').insert({ entry_id: id, body: newComment })
    if (error) return alert(error.message)
    setNewComment('')
    load()
  }

  return entry ? (
    <div>
      <h1>{entry.title}</h1>
      <p><strong>Date:</strong> {entry.date} | <strong>Status:</strong> {entry.status}</p>
      <p>{entry.body}</p>
      <p><strong>Minutes:</strong> {entry.minutes_spent}</p>
      <p><strong>KSBs:</strong> {entry.ksb_tags.join(', ')}</p>
      <p><strong>Evidence:</strong> {entry.evidence_urls.map(u=> <a key={u} href={u} target="_blank">{u}</a>)}</p>

      {me?.role === 'APPRENTICE' && entry.status === 'DRAFT' && (
        <button onClick={()=>submitEntry(entry.id).then(load)}>Submit for review</button>
      )}
      {me?.role === 'COACH' && entry.status === 'SUBMITTED' && (
        <button onClick={()=>approveEntry(entry.id).then(load)}>Approve</button>
      )}

      <h2>Comments</h2>
      <ul>
        {comments.map(c => <li key={c.id}>{new Date(c.created_at).toLocaleString()}: {c.body}</li>)}
      </ul>
      {me?.role === 'COACH' && (
        <div style={{ display:'flex', gap:8 }}>
          <input placeholder="Add comment" value={newComment} onChange={e=>setNewComment(e.target.value)} />
          <button onClick={addComment}>Send</button>
        </div>
      )}
    </div>
  ) : <div>Loading...</div>
}