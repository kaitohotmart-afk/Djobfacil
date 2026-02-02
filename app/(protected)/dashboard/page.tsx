import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, LogOut, Sparkles, Briefcase, ShoppingBag, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 bg-slate-950/80 border-b border-white/10 backdrop-blur-xl sticky top-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3 group">
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

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="relative text-cyan-400 font-medium group">
                                Início
                                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                            </Link>
                            <Link href="/pedidos" className="text-gray-400 hover:text-gray-200 transition-colors">
                                Preciso de Profissional
                            </Link>
                            <Link href="/servicos" className="text-gray-400 hover:text-gray-200 transition-colors">
                                Oferecer Meus Serviços
                            </Link>
                            <Link href="/marketplace" className="text-gray-400 hover:text-gray-200 transition-colors">
                                Marketplace
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-white">
                                    {userData?.nome_completo || user.email}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {userData?.provincia}
                                </span>
                            </div>
                            <form action="/api/auth/signout" method="post">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sair
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative container mx-auto px-4 py-12">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {userData?.tipo_conta === 'ambos' ? 'Cliente & Prestador' : userData?.tipo_conta === 'prestador' ? 'Prestador' : 'Cliente'}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        <span className="text-white">Bem-vindo, </span>
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {userData?.nome_completo?.split(' ')[0] || 'Usuário'}
                        </span>
                        <span className="text-4xl">👋</span>
                    </h1>
                    {userData?.provincia && (
                        <p className="text-gray-400 text-lg">
                            📍 {userData.cidade}, {userData.provincia}
                        </p>
                    )}
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-white/10 p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all"></div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
                                📢 Preciso de um Profissional
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Publique o que você precisa e receba propostas de profissionais.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                                asChild
                            >
                                <Link href="/pedidos">Ver Pedidos</Link>
                            </Button>
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-white/10 p-8 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all"></div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-cyan-600 to-teal-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
                                🛠️ Oferecer Meus Serviços
                                <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">Novo</Badge>
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Crie seu perfil profissional e encontre clientes na sua região ou online.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                                asChild
                            >
                                <Link href="/servicos">Ver Serviços</Link>
                            </Button>
                        </div>
                    </Card>

                    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-white/10 p-8 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all"></div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
                                🛍️ Marketplace
                                <Badge className="bg-purple-500/20 text-purple-300 text-xs">Ativo</Badge>
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Compre e venda produtos físicos com segurança na sua região.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
                                asChild
                            >
                                <Link href="/marketplace">Ver Marketplace</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}
