-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items are public" 
  ON portfolio_items FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own portfolio items" 
  ON portfolio_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items" 
  ON portfolio_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Storage Bucket Policy (This usually requires insertion into storage.buckets, but often done via Dashboard. 
-- We will assume the bucket 'portfolio' needs to be created manually or via client if not exists, 
-- but we can try to set policies for objects in it if it exists)

-- Policy for 'portfolio' bucket objects
-- Allow public access to read
CREATE POLICY "Portfolio images are public"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- Allow authenticated users to upload
CREATE POLICY "Users can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- Allow users to delete their own images (simplified)
CREATE POLICY "Users can delete their own portfolio images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio' AND auth.uid() = owner );
