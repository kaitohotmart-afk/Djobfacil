'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, MessageCircle, User, Briefcase, ShoppingBag, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function BottomNav() {
    const pathname = usePathname()

    // Function to check if link is active
    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true
        if (path !== '/dashboard' && pathname.startsWith(path)) return true
        return false
    }

    return (
        <>
            {/* Spacer to prevent content from being hidden behind the bar */}
            <div className="h-16 md:hidden" />

            <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 md:hidden z-50 px-4 pb-safe">
                <div className="flex items-center justify-around h-full max-w-md mx-auto">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive('/dashboard') ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <Home className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Início</span>
                    </Link>

                    <Link
                        href="/servicos"
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive('/servicos') ? "text-cyan-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <Search className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Buscar</span>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 border border-white/20 shadow-lg shadow-blue-500/20 -mt-6 hover:shadow-blue-500/40 transition-all"
                            >
                                <Plus className="h-6 w-6 text-white" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="center" className="mb-2 bg-slate-900 border-white/10">
                            <DropdownMenuItem asChild>
                                <Link href="/pedidos/novo" className="flex items-center gap-2 cursor-pointer text-gray-200 focus:text-white focus:bg-white/10">
                                    <Briefcase className="h-4 w-4 text-blue-400" />
                                    <span>Novo Pedido</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/servicos/novo" className="flex items-center gap-2 cursor-pointer text-gray-200 focus:text-white focus:bg-white/10">
                                    <Package className="h-4 w-4 text-cyan-400" />
                                    <span>Novo Serviço</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/marketplace/novo" className="flex items-center gap-2 cursor-pointer text-gray-200 focus:text-white focus:bg-white/10">
                                    <ShoppingBag className="h-4 w-4 text-purple-400" />
                                    <span>Vender Produto</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/chat"
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive('/chat') ? "text-green-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Chat</span>
                    </Link>

                    <Link
                        href="/conta/perfil"
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive('/conta') ? "text-purple-400" : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        <User className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </div>
            </div>
        </>
    )
}
