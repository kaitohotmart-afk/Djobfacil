import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShieldCheck, MessageSquare, Users, Package } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DJOB FACIL</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Conectando quem precisa com quem oferece
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma moçambicana que une clientes e prestadores de serviços,
            além de facilitar a venda de produtos físicos. Tudo em um só lugar,
            com segurança e confiança.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Começar Agora
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Três áreas em uma</h3>
            <p className="text-gray-600">
              Pedidos de serviços, prestadores profissionais e marketplace de produtos.
              Tudo integrado na mesma plataforma.
            </p>
          </Card>
          <Card className="p-6">
            <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chat integrado</h3>
            <p className="text-gray-600">
              Converse diretamente na plataforma. Transparência e segurança
              em todas as negociações.
            </p>
          </Card>
          <Card className="p-6">
            <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Proteção garantida</h3>
            <p className="text-gray-600">
              Serviços digitais com intermediação da plataforma e avisos
              de segurança automáticos em todos os chats.
            </p>
          </Card>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Criar conta</h3>
                <p className="text-gray-600">
                  Cadastre-se gratuitamente informando seus dados pessoais e localização.
                  Escolha se quer oferecer serviços, encontrar serviços ou ambos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fazer login</h3>
                <p className="text-gray-600">
                  Acesse sua conta com email e senha. Sua segurança é garantida
                  por criptografia de ponta.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Aceder ao dashboard</h3>
                <p className="text-gray-600">
                  Veja pedidos ativos, serviços disponíveis e produtos no marketplace.
                  Tudo organizado e fácil de encontrar.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ver e publicar</h3>
                <p className="text-gray-600">
                  Navegue por pedidos, serviços e produtos filtrados por província e categoria.
                  Ou publique o seu próprio conteúdo em poucos cliques.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Conversar dentro da plataforma</h3>
                <p className="text-gray-600">
                  Inicie conversas diretamente no chat integrado. Negocie valores,
                  combine detalhes e feche negócios com segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avisos de Segurança */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Segurança em Primeiro Lugar</h2>
          <div className="space-y-4">
            <Card className="p-6 border-l-4 border-l-yellow-500">
              <h3 className="font-semibold text-lg mb-2">⚠️ Serviços Locais (Presenciais)</h3>
              <p className="text-gray-700">
                A plataforma NÃO intermedia pagamentos de serviços locais.
                Combine valores e detalhes diretamente com o prestador.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-lg mb-2">🔒 Serviços Digitais</h3>
              <p className="text-gray-700">
                Serviços digitais TÊM intermediação da plataforma. O administrador
                acompanha a conversa para segurança de ambas as partes. Taxa de 10% aplicada.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500">
              <h3 className="font-semibold text-lg mb-2">🛒 Produtos Físicos</h3>
              <p className="text-gray-700">
                A plataforma NÃO intermedia pagamentos de produtos físicos.
                Encontre-se em locais públicos e verifique o produto antes de pagar.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
              <h3 className="font-semibold text-lg mb-2">💬 Chat Seguro</h3>
              <p className="text-gray-700">
                Todas as conversas ficam registradas na plataforma. Mensagens
                não podem ser editadas ou apagadas, garantindo transparência.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se à comunidade e conecte-se com milhares de moçambicanos
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 DJOB FACIL. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Plataforma moçambicana de serviços e marketplace</p>
        </div>
      </footer>
    </div>
  )
}
