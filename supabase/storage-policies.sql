-- Create bucket in Dashboard named: evidence (public: false)
-- Then attach policies via SQL (example private bucket rule):

-- Allow owner read/write under their folder evidence/{user_id}/...
create policy "owner rw evidence" on storage.objects
  for all using (
    bucket_id = 'evidence' and owner = auth.uid()
  ) with check (
    bucket_id = 'evidence' and owner = auth.uid()
  );