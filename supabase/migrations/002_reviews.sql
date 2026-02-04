-- MIGRATION 002: Reviews System

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  avaliado_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  servico_id UUID REFERENCES services(id) ON DELETE SET NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT CHECK (LENGTH(comentario) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_reviews_avaliado ON reviews(avaliado_id);
CREATE INDEX IF NOT EXISTS idx_reviews_avaliador ON reviews(avaliador_id);
CREATE INDEX IF NOT EXISTS idx_reviews_servico ON reviews(servico_id);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read reviews
CREATE POLICY "Reviews are public" ON reviews
  FOR SELECT USING (true);

-- Policy: Authenticated users can create reviews (server-side validation enforced for business logic)
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = avaliador_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = avaliador_id);
