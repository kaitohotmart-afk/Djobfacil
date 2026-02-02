import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, AlertTriangle, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface RequestCardProps {
    request: {
        id: string
        titulo: string
        descricao: string
        categoria: string
        provincia: string
        cidade: string
        urgente: boolean
        created_at: string
        author: {
            nome_completo: string
            foto_url?: string | null
        } | null
    }
}

export function RequestCard({ request }: RequestCardProps) {
    return (
        <Card className={cn(
            "group relative border-slate-800 bg-slate-900/40 backdrop-blur-md transition-all duration-500 hover:bg-slate-900/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
            request.urgente && "border-l-4 border-l-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
        )}>
            <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 transition-colors uppercase text-[10px] tracking-wider font-semibold">
                            {request.categoria}
                        </Badge>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{request.titulo}</h3>
                    </div>
                    {request.urgente && (
                        <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-full text-rose-500 text-[10px] font-bold uppercase tracking-tighter animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                            <AlertTriangle className="w-3 h-3" />
                            Urgente
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pb-3 px-6">
                <p className="text-slate-400 text-sm line-clamp-3 mb-6 min-h-[60px] leading-relaxed">
                    {request.descricao}
                </p>

                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center text-slate-500 group-hover:text-slate-400 transition-colors">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500/70" />
                        {request.cidade}, {request.provincia}
                    </div>
                    <div className="flex items-center text-slate-500 group-hover:text-slate-400 transition-colors">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500/70" />
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-800/50 flex justify-between items-center group-hover:border-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-blue-500/30 overflow-hidden transition-all">
                            {request.author?.foto_url ? (
                                <img src={request.author.foto_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-semibold group-hover:text-slate-300 transition-colors line-clamp-1">
                            {request.author?.nome_completo}
                        </span>
                        <span className="text-[10px] text-slate-500">Autor do pedido</span>
                    </div>
                </div>

                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-9 px-5 shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 transition-all rounded-lg">
                    <Link href={`/pedidos/${request.id}`}>
                        Propor Serviço
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
