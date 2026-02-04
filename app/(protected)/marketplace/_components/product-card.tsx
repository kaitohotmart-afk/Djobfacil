'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Tag, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProductCardProps {
    product: {
        id: string
        titulo: string
        preco: number
        categoria: string
        provincia: string
        cidade: string
        foto_url: string | null
        user_id: string
    }
    currentUserId?: string
}

export function ProductCard({ product, currentUserId }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
    }).format(product.preco)

    const isOwner = currentUserId === product.user_id

    return (
        <Card className="group relative bg-slate-900/40 border-slate-800 hover:border-blue-500/50 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-md">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-slate-950 flex items-center justify-center border-b border-slate-800">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {product.foto_url ? (
                    <img
                        src={product.foto_url}
                        alt={product.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-700 gap-3 group-hover:text-blue-500/50 transition-colors">
                        <Tag className="h-12 w-12 opacity-20" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-40">Sem imagem</span>
                    </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-md border-none shadow-xl text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                        {product.categoria}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-blue-400 transition-colors">
                        {product.titulo}
                    </h3>
                </div>

                <div className="space-y-3 mt-auto">
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-blue-500/70">MZN</span>
                        <p className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">
                            {new Intl.NumberFormat('pt-MZ').format(product.preco)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium transition-colors group-hover:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-blue-500/60" />
                        <span className="truncate">{product.provincia}, {product.cidade}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button className={cn(
                    "w-full font-bold h-11 border transition-all rounded-xl relative overflow-hidden group/btn",
                    isOwner
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                        : "bg-slate-800/50 hover:bg-blue-600 text-white border-slate-700/50 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-900/40"
                )} asChild>
                    <Link href={`/marketplace/${product.id}`}>
                        <div className={cn("absolute inset-0 transition-opacity", isOwner ? "bg-slate-700/0" : "bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100")} />
                        <span className="relative flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            {isOwner ? 'Gerenciar Produto' : 'Ver Detalhes'}
                        </span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
