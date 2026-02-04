import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function ChatListPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch conversations with participants details
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

    // Fetch last message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
            // Get last message
            const { data: lastMessage } = await supabase
                .from('messages')
                .select('content, created_at, tipo_mensagem, sender_id')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            // Get unread count for this user
            const { count: unreadCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conv.id)
                .neq('sender_id', user.id)
                .not('lida_por', 'cs', `{"${user.id}"}`)

            return { ...conv, lastMessage, unreadCount: unreadCount || 0 }
        })
    )

    return (
        <div className="container max-w-2xl py-8 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">Minhas Conversas</h1>

            {conversationsWithDetails.length === 0 ? (
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
                    {conversationsWithDetails.map((conv) => {
                        // Determine who is the "other" person
                        // Supabase foreign key joins return single object, not array
                        const cliente = Array.isArray(conv.cliente) ? conv.cliente[0] : conv.cliente
                        const prestador = Array.isArray(conv.prestador) ? conv.prestador[0] : conv.prestador
                        const isMeClient = cliente.id === user.id
                        const otherUser = isMeClient ? prestador : cliente

                        // Get preview text
                        let previewText = 'Nenhuma mensagem ainda'
                        if (conv.lastMessage) {
                            if (conv.lastMessage.tipo_mensagem === 'aviso') {
                                previewText = '⚠️ Aviso de segurança'
                            } else if (conv.lastMessage.tipo_mensagem === 'sistema') {
                                previewText = '🔔 Mensagem do sistema'
                            } else {
                                const isMeSender = conv.lastMessage.sender_id === user.id
                                const prefix = isMeSender ? 'Você: ' : ''
                                previewText = prefix + (conv.lastMessage.content.length > 40
                                    ? conv.lastMessage.content.substring(0, 40) + '...'
                                    : conv.lastMessage.content)
                            }
                        }

                        return (
                            <Link key={conv.id} href={`/chat/${conv.id}`} className="block group">
                                <Card className="bg-slate-900/50 border-white/10 p-4 transition-all hover:bg-slate-800 hover:border-blue-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0 relative">
                                            {otherUser?.foto_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={otherUser.foto_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="text-white font-medium truncate group-hover:text-blue-400">
                                                    {otherUser?.nome_completo || 'Usuário Desconhecido'}
                                                </h3>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {conv.unreadCount > 0 && (
                                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                            {conv.unreadCount}
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {conv.lastMessage
                                                            ? formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true, locale: ptBR })
                                                            : formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: ptBR })
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                {previewText}
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
