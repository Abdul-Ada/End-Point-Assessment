-- Create the events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'Deadline', 'Milestone', 'Meeting'
  description TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own events
CREATE POLICY "Users can manage their own events"
ON events
FOR ALL
USING (auth.uid() = user_id);
