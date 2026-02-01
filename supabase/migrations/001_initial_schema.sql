-- ========================================
-- MVP - Plataforma de Serviços Moçambique
-- MIGRATION 001: Initial Schema
-- ========================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  bairro VARCHAR(100),
  bio TEXT CHECK (LENGTH(bio) <= 200),
  foto_url TEXT,
  tipo_conta VARCHAR(20) NOT NULL DEFAULT 'ambos' CHECK (tipo_conta IN ('prestador', 'cliente', 'ambos')),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'bloqueado')),
  termos_aceitos BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 2. REQUESTS TABLE (Pedidos)
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  urgente BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'fechado', 'removido')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE (Serviços)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('local', 'digital')),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'removido')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS TABLE (Marketplace)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  foto_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'removido')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONVERSATIONS TABLE (Conversas)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_conversa VARCHAR(20) NOT NULL CHECK (tipo_conversa IN ('pedido', 'servico_local', 'servico_digital', 'produto')),
  relacionado_id UUID NOT NULL,
  cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_participante BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'problema')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGES TABLE (Mensagens)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tipo_mensagem VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (tipo_mensagem IN ('normal', 'sistema', 'admin', 'aviso')),
  content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- USERS
CREATE INDEX IF NOT EXISTS idx_users_provincia ON users(provincia);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- REQUESTS
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_categoria ON requests(categoria);
CREATE INDEX IF NOT EXISTS idx_requests_provincia ON requests(provincia);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_urgente ON requests(urgente) WHERE urgente = TRUE;

-- SERVICES
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_tipo ON services(tipo);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_categoria ON services(categoria);
CREATE INDEX IF NOT EXISTS idx_services_provincia ON services(provincia);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

-- PRODUCTS
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_provincia ON products(provincia);
CREATE INDEX IF NOT EXISTS idx_products_preco ON products(preco);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- CONVERSATIONS
CREATE INDEX IF NOT EXISTS idx_conversations_tipo ON conversations(tipo_conversa);
CREATE INDEX IF NOT EXISTS idx_conversations_cliente ON conversations(cliente_id);
CREATE INDEX IF NOT EXISTS idx_conversations_prestador ON conversations(prestador_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_admin ON conversations(admin_participante) WHERE admin_participante = TRUE;
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- MESSAGES
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_lida ON messages(lida) WHERE lida = FALSE;

-- ========================================
-- TRIGGERS (Atualização automática de timestamps)
-- ========================================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para USERS
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para REQUESTS
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para SERVICES
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para PRODUCTS
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para CONVERSATIONS
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
