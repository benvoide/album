-- Enable UUID extension.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Publications (albums).
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  privacy_level TEXT NOT NULL CHECK (privacy_level IN ('private', 'link', 'public')) DEFAULT 'private',
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Photos within a publication.
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for publications.
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own publications"
  ON publications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public publications"
  ON publications FOR SELECT
  USING (privacy_level = 'public');

CREATE POLICY "Users can view link publications with valid token"
  ON publications FOR SELECT
  USING (
    privacy_level = 'link'
    AND share_token IS NOT NULL
  );

CREATE POLICY "Users can insert own publications"
  ON publications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own publications"
  ON publications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own publications"
  ON publications FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for photos (inherits from publication access).
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos in accessible publications"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM publications p
      WHERE p.id = publication_id
      AND (
        p.user_id = auth.uid()
        OR p.privacy_level = 'public'
        OR (p.privacy_level = 'link' AND p.share_token IS NOT NULL)
      )
    )
  );

CREATE POLICY "Users can insert photos in own publications"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM publications p
      WHERE p.id = publication_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update photos in own publications"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM publications p
      WHERE p.id = publication_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos in own publications"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM publications p
      WHERE p.id = publication_id AND p.user_id = auth.uid()
    )
  );

-- Storage bucket for photos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: only owner can upload to their folder.
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
