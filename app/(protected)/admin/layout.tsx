import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, MessageCircle, LogOut } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Double check admin role in DB
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Gestão da Plataforma</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/usuarios" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                        <Users className="h-5 w-5" />
                        Usuários
                    </Link>
                    <Link href="/admin/conteudo" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                        <FileText className="h-5 w-5" />
                        Conteúdo
                    </Link>
                    <Link href="/admin/chats" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        Chats
                    </Link>
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-blue-400 hover:bg-blue-950/30 rounded-lg transition-colors text-sm">
                        <LogOut className="h-4 w-4" />
                        Voltar ao Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
