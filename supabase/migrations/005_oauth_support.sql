-- ========================================
-- MIGRATION 005: OAuth Support
-- ========================================
-- Permite que usuários OAuth tenham perfis incompletos temporariamente

-- 1. Tornar campos opcionais para OAuth
ALTER TABLE users 
  ALTER COLUMN provincia DROP NOT NULL,
  ALTER COLUMN cidade DROP NOT NULL,
  ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Adicionar coluna para rastrear perfis completos
ALTER TABLE users 
  ADD COLUMN perfil_completo BOOLEAN DEFAULT TRUE;

-- 3. Marcar perfis existentes como completos
UPDATE users SET perfil_completo = TRUE WHERE provincia IS NOT NULL AND cidade IS NOT NULL;

-- 4. Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_users_perfil_completo ON users(perfil_completo) WHERE perfil_completo = FALSE;

-- COMENTÁRIOS:
-- - OAuth users terão perfil_completo = FALSE inicialmente
-- - Após preencher provincia/cidade, será TRUE
-- - password_hash vazio é OK para OAuth (usam auth.users do Supabase)
