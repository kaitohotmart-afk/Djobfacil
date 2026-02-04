import { Package, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

interface LegalContentProps {
    title: string
    updatedAt?: string
    children: React.ReactNode
}

export function LegalContent({ title, updatedAt, children }: LegalContentProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-between mx-auto px-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-1.5 rounded-lg">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            DJOB FACIL
                        </span>
                    </Link>

                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Voltar ao Início
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-12 md:py-20 px-4">
                <article className="max-w-3xl mx-auto">
                    <div className="mb-12 border-b border-white/10 pb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {title}
                        </h1>
                        {updatedAt && (
                            <p className="text-slate-500 text-sm">
                                Última atualização: <span className="text-slate-400">{updatedAt}</span>
                            </p>
                        )}
                    </div>

                    <div className="prose prose-invert prose-slate max-w-none 
                        prose-headings:text-white prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                        prose-ul:text-slate-300 prose-ul:mb-6
                        prose-strong:text-white prose-strong:font-semibold
                        prose-hr:border-white/10 prose-hr:my-10">
                        {children}
                    </div>
                </article>
            </main>

            {/* Simple Footer inside Legal Pages */}
            <footer className="border-t border-white/10 py-8 bg-slate-950/50">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 italic">
                        &copy; 2026 DJOB FACIL. A plataforma oficial de serviços em Moçambique.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/termos-de-uso" className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline">Termos</Link>
                        <Link href="/politica-privacidade" className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline">Privacidade</Link>
                        <Link href="/sobre" className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline">Sobre</Link>
                        <Link href="/dicas-seguranca" className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline">Segurança</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
