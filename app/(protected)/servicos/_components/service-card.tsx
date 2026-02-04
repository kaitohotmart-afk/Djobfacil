import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Laptop, User, ArrowRight, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getUserRating } from '@/app/(protected)/reviews/actions'

interface ServiceCardProps {
    service: any
    currentUserId?: string
}

export async function ServiceCard({ service, currentUserId }: ServiceCardProps) {
    const isOwner = currentUserId === service.user_id
    const isDigital = service.tipo === 'digital'

    // Fetch rating
    const { average, count } = await getUserRating(service.user_id)

    return (
        <Card className="flex flex-col h-full bg-slate-900/40 border-slate-800 hover:border-blue-500/50 transition-all duration-500 group overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-md">
            <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className={cn(
                        "font-bold uppercase tracking-widest text-[10px] px-2.5 py-1 backdrop-blur-md border-none shadow-lg transition-colors",
                        isDigital ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                    )}>
                        {isDigital ? <Laptop className="w-3.5 h-3.5 mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                        {isDigital ? 'Digital' : 'Local'}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(service.created_at), { addSuffix: true, locale: ptBR })}
                    </div>
                </div>
                <h3 className="font-bold text-xl text-white line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-blue-400 transition-colors">
                    {service.titulo}
                </h3>
            </CardHeader>

            <CardContent className="p-6 pt-0 flex-grow space-y-6">
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {service.descricao}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:bg-slate-700/80">
                        {service.categoria}
                    </span>
                    {!isDigital && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-blue-500/60" />
                            <span className="truncate max-w-[150px]">{service.cidade}, {service.provincia}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-6 border-t border-slate-800/50 mt-auto flex items-center justify-between bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-blue-500/30 transition-all">
                        {service.author?.foto_url ? (
                            <img src={service.author.foto_url} alt={service.author.nome_completo} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-4 w-4 text-slate-500" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-300 font-bold group-hover:text-blue-400 transition-colors line-clamp-1">
                            {service.author?.nome_completo || 'Profissional'}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 font-medium">Prestador</span>
                            {count > 0 && (
                                <>
                                    <span className="text-[10px] text-slate-600">•</span>
                                    <span className="flex items-center text-[10px] text-amber-400 font-bold">
                                        <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-400" />
                                        {average} <span className="text-slate-500 ml-0.5 font-normal">({count})</span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Button size="sm" className={cn(
                    "font-bold h-9 px-4 rounded-lg shadow-lg transition-all",
                    isOwner ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20 hover:shadow-blue-500/40"
                )} asChild>
                    <Link href={`/servicos/${service.id}`}>
                        {isOwner ? 'Painel' : 'Contratar'}
                        {!isOwner && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
