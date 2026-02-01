# MVP - Plataforma de Serviços Moçambique (DJOB FACIL)

Plataforma que conecta pessoas que precisam de serviços com pessoas que oferecem serviços, além de marketplace de produtos físicos.

## 🚀 Stack Técnica

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage)
- **Forms**: React Hook Form + Zod
- **Deploy**: Vercel (frontend) + Supabase (backend)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- Conta Vercel (para deploy)

## 🛠️ Setup Local

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd djob-facil
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Preencha as variáveis no arquivo `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anon do seu projeto Supabase

4. **Configure o banco de dados Supabase**
   - Acesse o SQL Editor no Supabase
   - Execute os scripts de migração em `supabase/migrations/`
   - Execute o script de seed (dados iniciais) se necessário

5. **Execute em desenvolvimento**
   ```bash
   npm run dev
   ```
   
   Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
djob-facil/
├── app/
│   ├── (public)/          # Rotas públicas (Landing, Login, Sign up)
│   ├── (protected)/       # Rotas protegidas (Dashboard, Pedidos, etc)
│   ├── admin/             # Painel administrativo
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── forms/             # Form components
├── lib/
│   ├── supabase/          # Configuração Supabase
│   ├── utils.ts           # Utilitários
│   ├── validations.ts     # Schemas Zod
│   └── constants.ts       # Constantes (províncias, categorias)
├── types/                 # TypeScript types
└── supabase/
    └── migrations/        # SQL migrations
```

## 👥 Admin

Para marcar um usuário como administrador:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'kaitoluismiropo@gmail.com';
```

## 🔧 Comandos Principais

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção localmente
npm start

# Lint
npm run lint
```

## 📦 Deploy

### Vercel (Automático)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main

### Supabase

1. Projeto já configurado em cloud.supabase.com
2. Migrations aplicadas automaticamente via CLI (futuro)

## 🗺️ Roadmap

### ✅  Etapa 1: Base + Autenticação (Semanas 1-2)
- Setup do projeto
- Autenticação completa
- Landing Page
- Dashboard básico

### 📍 Etapa 2: Painel Admin (Semana 3)
- Dashboard admin
- Gestão de usuários
- Gestão de conteúdo

### Etapa 3: Pedidos (Semana 4)
- Criar e listar pedidos
- Responder pedidos
- Chat básico

### Etapa 4: Serviços (Semana 5)
- Criar e listar serviços
- Diferenciação Local/Digital
- Admin em chats digitais

### Etapa 5: Marketplace (Semana 6)
- Publicar produtos
- Upload de fotos
- Chat de produtos

### Etapa 6: Chat Completo (Semana 7)
- Supabase Realtime
- Interface polida
- Avisos automáticos

### Etapa 7: Perfis (Semana 8)
- Perfil público
- Minha Conta
- Editar perfil

### Etapa 8: Polimento e Deploy (Semanas 9-10)
- Testes
- Responsividade
- Performance
- Deploy final

## 📞 Contato

Para dúvidas e suporte durante o desenvolvimento, entre em contato com a equipe.

## 📄 Licença

[Definir licença]

