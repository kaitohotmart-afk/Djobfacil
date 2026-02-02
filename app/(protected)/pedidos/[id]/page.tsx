import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StartChatButton } from '../_components/start-chat-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, User, AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function RequestDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: request } = await supabase
        .from('requests')
        .select(`
      *,
      author:user_id (
        id,
        nome_completo,
        foto_url,
        email,
        cidade
      )
    `)
        .eq('id', params.id)
        .single()

    if (!request) {
        notFound()
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const isOwner = currentUser?.id === request.user_id

    return (
        <div className="container max-w-4xl py-8">
            <Link
                href="/pedidos"
                className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar para Pedidos
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-blue-400 border-blue-400/20">{request.categoria}</Badge>
                            {request.urgente && (
                                <Badge variant="destructive" className="animate-pulse">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> URGENTE
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{request.titulo}</h1>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                            <div className="flex items-center">
                                <MapPin className="mr-1 h-4 w-4" />
                                {request.cidade}, {request.provincia}
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                Publicado {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                            </div>
                        </div>
                    </div>

                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Descrição do Pedido</h3>
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                                {request.descricao}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <Card className="bg-slate-900 border-white/10 shadow-xl shadow-blue-900/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-2">Interessado neste serviço?</p>
                                {isOwner ? (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
                                        Este é seu próprio pedido.
                                    </div>
                                ) : (
                                    <StartChatButton requestId={request.id} />
                                )}
                            </div>
                            {!isOwner && (
                                <p className="text-xs text-center text-gray-500">
                                    Ao clicar, você iniciará uma conversa segura com o cliente.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* User Profile Card */}
                    <Card className="bg-slate-900/30 border-white/5">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
                                    {request.author?.foto_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={request.author.foto_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{request.author?.nome_completo}</p>
                                    <p className="text-xs text-gray-500">Cliente desde {new Date().getFullYear()}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Local:</span>
                                    <span className="text-white">{request.author?.cidade || 'Não informado'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Verificado:</span>
                                    <span className="text-green-400">Email Verificado</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
