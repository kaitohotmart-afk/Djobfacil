import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, MessageSquare, Users, Package, Sparkles, Zap, Heart, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container flex h-20 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DJOB FACIL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all">
                Criar Conta
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 text-sm px-4 py-1">
            <Zap className="h-3 w-3 mr-2" />
            100% Moçambicano
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Conectando quem precisa
            </span>
            <br />
            <span className="text-white">
              com quem oferece
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A plataforma moçambicana que une <span className="text-cyan-400 font-semibold">clientes</span> e{' '}
            <span className="text-blue-400 font-semibold">prestadores de serviços</span>,
            com marketplace integrado. Tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-6 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/60 hover:scale-105 transition-all group">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm">
                Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Três áreas em uma</h3>
              <p className="text-gray-400 leading-relaxed">
                Pedidos de serviços, prestadores profissionais e marketplace de produtos.
                Tudo integrado na mesma plataforma.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 p-8 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Chat integrado</h3>
              <p className="text-gray-400 leading-relaxed">
                Converse diretamente na plataforma. Transparência e segurança
                em todas as negociações.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 p-8 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Proteção garantida</h3>
              <p className="text-gray-400 leading-relaxed">
                Serviços digitais com intermediação da plataforma e avisos
                de segurança automáticos em todos os chats.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="relative py-24 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-4">
              Processo Simples
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Como Funciona</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              5 passos simples para começar a usar a plataforma
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                num: 1,
                title: 'Criar conta',
                desc: 'Cadastre-se gratuitamente informando seus dados pessoais e localização. Escolha se quer oferecer serviços, encontrar serviços ou ambos.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                num: 2,
                title: 'Fazer login',
                desc: 'Acesse sua conta com email e senha. Sua segurança é garantida por criptografia de ponta.',
                color: 'from-cyan-500 to-teal-500'
              },
              {
                num: 3,
                title: 'Aceder ao dashboard',
                desc: 'Veja pedidos ativos, serviços disponíveis e produtos no marketplace. Tudo organizado e fácil de encontrar.',
                color: 'from-teal-500 to-green-500'
              },
              {
                num: 4,
                title: 'Ver e publicar',
                desc: 'Navegue por pedidos, serviços e produtos filtrados por província e categoria. Ou publique o seu próprio conteúdo em poucos cliques.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                num: 5,
                title: 'Conversar dentro da plataforma',
                desc: 'Inicie conversas diretamente no chat integrado. Negocie valores, combine detalhes e feche negócios com segurança.',
                color: 'from-emerald-500 to-cyan-500'
              }
            ].map((step) => (
              <div key={step.num} className="group flex gap-6 p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/20 hover:bg-slate-900/70 transition-all backdrop-blur-sm">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avisos de Segurança */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Heart className="h-3 w-3 mr-2" />
              Sua Segurança
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Segurança em Primeiro Lugar
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-l-yellow-500 border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-xl text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
                    Serviços Locais (Presenciais)
                  </h3>
                  <p className="text-gray-300">
                    A plataforma NÃO intermedia pagamentos de serviços locais.
                    Combine valores e detalhes diretamente com o prestador.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-l-4 border-l-blue-500 border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔒</span>
                <div>
                  <h3 className="font-bold text-xl text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    Serviços Digitais
                  </h3>
                  <p className="text-gray-300">
                    Serviços digitais TÊM intermediação da plataforma. O administrador
                    acompanha a conversa para segurança de ambas as partes. Taxa de 10% aplicada.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-l-4 border-l-orange-500 border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🛒</span>
                <div>
                  <h3 className="font-bold text-xl text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                    Produtos Físicos
                  </h3>
                  <p className="text-gray-300">
                    A plataforma NÃO intermedia pagamentos de produtos físicos.
                    Encontre-se em locais públicos e verifique o produto antes de pagar.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-l-green-500 border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/10 transition-all group">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💬</span>
                <div>
                  <h3 className="font-bold text-xl text-green-400 mb-2 group-hover:text-green-300 transition-colors">
                    Chat Seguro
                  </h3>
                  <p className="text-gray-300">
                    Todas as conversas ficam registradas na plataforma. Mensagens
                    não podem ser editadas ou apagadas, garantindo transparência.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Pronto para começar?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Junte-se à comunidade e conecte-se com milhares de moçambicanos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-10 py-7 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/60 hover:scale-105 transition-all">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar Conta Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DJOB FACIL
            </span>
          </div>
          <p className="text-gray-400">&copy; 2026 DJOB FACIL. Todos os direitos reservados.</p>
          <p className="text-sm text-gray-500">Plataforma moçambicana de serviços e marketplace</p>
        </div>
      </footer>
    </div>
  )
}
