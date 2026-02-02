import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { User, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function ChatListPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch conversations with participants details
    // Using resource aliases based on foreign keys
    const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
      id,
      tipo_conversa,
      updated_at,
      status,
      cliente:users!conversations_cliente_id_fkey(id, nome_completo, foto_url),
      prestador:users!conversations_prestador_id_fkey(id, nome_completo, foto_url)
    `)
        .or(`cliente_id.eq.${user.id},prestador_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        return <div className="p-8 text-red-400">Erro ao carregar conversas.</div>
    }

    return (
        <div className="container max-w-2xl py-8 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">Minhas Conversas</h1>

            {conversations.length === 0 ? (
                <Card className="bg-slate-900/50 border-white/10 p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white">Nenhuma conversa ainda</h3>
                    <p className="text-gray-400 mt-2">
                        Suas negociações de serviços e produtos aparecerão aqui.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link href="/pedidos" className="text-blue-400 hover:underline">Ver Pedidos</Link>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {conversations.map((conv) => {
                        // Determine who is the "other" person
                        const isMeClient = conv.cliente.id === user.id
                        const otherUser = isMeClient ? conv.prestador : conv.cliente

                        return (
                            <Link key={conv.id} href={`/chat/${conv.id}`} className="block group">
                                <Card className="bg-slate-900/50 border-white/10 p-4 transition-all hover:bg-slate-800 hover:border-blue-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                                            {otherUser?.foto_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={otherUser.foto_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-white font-medium truncate group-hover:text-blue-400">
                                                    {otherUser?.nome_completo || 'Usuário Desconhecido'}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: ptBR })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 truncate">
                                                {conv.tipo_conversa === 'pedido' ? 'Negociação de Pedido' : 'Conversa'}
                                                {/* Here we could show last message if fetched */}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
