import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Event } from '../types';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: '',
    type: 'Milestone' as Event['type'],
    description: '',
  });

  async function loadEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data as Event[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('events').insert({
      user_id: user.id,
      date: form.date,
      title: form.title,
      type: form.type,
      description: form.description,
    });

    if (error) {
      alert(error.message);
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        title: '',
        type: 'Milestone',
        description: '',
      });
      loadEvents();
    }
  }
  
  async function deleteEvent(id: string) {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) alert(error.message);
      else loadEvents();
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="mb-4 text-2xl font-semibold">Upcoming Events</h1>
        <div className="space-y-4">
          {loading && <p>Loading events...</p>}
          {!loading && events.length === 0 && <p>No events scheduled.</p>}
          {events.map((event) => (
            <Card key={event.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{event.title} <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{event.type}</span></p>
                <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                {event.description && <p className="mt-1 text-sm text-slate-600">{event.description}</p>}
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>Delete</Button>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Title</label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Date</label>
              <Input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Event['type'] })} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option>Milestone</option>
                <option>Deadline</option>
                <option>Meeting</option>
                <option>Reminder</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Description (Optional)</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button type="submit">Add Event</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
