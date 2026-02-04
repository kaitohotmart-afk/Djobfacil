import { Package } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                DJOB FACIL
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
                            A maior plataforma moçambicana de serviços e marketplace.
                            Conectando talentos e necessidades em todo o país.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold text-white mb-1">Institucional</span>
                            <Link href="/sobre" className="text-sm text-gray-400 hover:text-white transition-colors">Sobre Nós</Link>
                            <Link href="/servicos" className="text-sm text-gray-400 hover:text-white transition-colors">Serviços</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold text-white mb-1">Legal</span>
                            <Link href="/termos-de-uso" className="text-sm text-gray-400 hover:text-white transition-colors">Termos de Uso</Link>
                            <Link href="/politica-privacidade" className="text-sm text-gray-400 hover:text-white transition-colors">Privacidade</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold text-white mb-1">Suporte</span>
                            <Link href="/dicas-seguranca" className="text-sm text-gray-400 hover:text-white transition-colors">Segurança</Link>
                            <Link href="/ajuda" className="text-sm text-gray-400 hover:text-white transition-colors">Ajuda</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-bold text-white mb-1">Plataforma</span>
                            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Entrar</Link>
                            <Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">Cadastrar</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; 2026 DJOB FACIL. Todos os direitos reservados.
                    </p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        Feito com ❤️ em Moçambique
                    </p>
                </div>
            </div>
        </footer>
    )
}
