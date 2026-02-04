import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, Shield, Package, ShoppingBag, Briefcase, Image as ImageIcon } from 'lucide-react'

export default async function ContaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Minha Conta</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col space-y-2">
                        <Link
                            href="/conta/perfil"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <User className="h-5 w-5 text-blue-400" />
                            <span className="font-medium">Meu Perfil</span>
                        </Link>

                        <Link
                            href="/conta/seguranca"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <Shield className="h-5 w-5 text-green-400" />
                            <span className="font-medium">Segurança</span>
                        </Link>

                        <div className="h-px bg-slate-800 my-2"></div>

                        <Link
                            href="/conta/pedidos"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <Settings className="h-5 w-5 text-purple-400" />
                            <span className="font-medium">Meus Pedidos</span>
                        </Link>

                        <Link
                            href="/conta/servicos"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <Briefcase className="h-5 w-5 text-blue-400" />
                            <span className="font-medium">Meus Serviços</span>
                        </Link>

                        <Link
                            href="/conta/produtos"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <Package className="h-5 w-5 text-green-400" />
                            <span className="font-medium">Meus Produtos</span>
                        </Link>

                        <Link
                            href="/conta/portfolio"
                            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 text-slate-200 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                        >
                            <ImageIcon className="h-5 w-5 text-pink-400" />
                            <span className="font-medium">Meu Portfólio</span>
                        </Link>
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
