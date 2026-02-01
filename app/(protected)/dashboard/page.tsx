import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Buscar dados do usuário
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold">DJOB FACIL</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-blue-600 font-medium">
                                Início
                            </Link>
                            <Link href="/pedidos" className="text-gray-600 hover:text-gray-900">
                                Pedidos
                            </Link>
                            <Link href="/servicos" className="text-gray-600 hover:text-gray-900">
                                Serviços
                            </Link>
                            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
                                Marketplace
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {userData?.nome_completo || user.email}
                            </span>
                            <form action="/api/auth/signout" method="post">
                                <Button variant="ghost" size="sm">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sair
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bem-vindo, {userData?.nome_completo?.split(' ')[0] || 'Usuário'}! 👋
                    </h1>
                    <p className="text-gray-600">
                        {userData?.provincia && `${userData.cidade}, ${userData.provincia}`}
                    </p>
                </div>

                {/* Empty States - Serão preenchidos nas próximas etapas */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-semibold mb-4">💼 Pedidos Ativos</h2>
                        <p className="text-gray-500 text-sm">
                            Em breve você verá pedidos disponíveis aqui
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-semibold mb-4">🛠️ Serviços Disponíveis</h2>
                        <p className="text-gray-500 text-sm">
                            Em breve você verá serviços disponíveis aqui
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border">
                        <h2 className="text-lg font-semibold mb-4">🛒 Produtos no Marketplace</h2>
                        <p className="text-gray-500 text-sm">
                            Em breve você verá produtos disponíveis aqui
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
