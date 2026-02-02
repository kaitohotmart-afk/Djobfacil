import { createClient } from '@/lib/supabase/server'
import { ChatInterface } from '../_components/chat-interface'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'

export default async function ChatPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Conversation
    const { data: conversation } = await supabase
        .from('conversations')
        .select(`
      *,
      cliente:users!conversations_cliente_id_fkey(id, nome_completo, foto_url),
      prestador:users!conversations_prestador_id_fkey(id, nome_completo, foto_url)
    `)
        .eq('id', params.id)
        .single()

    if (!conversation) notFound()

    // Security Check (RLS does this, but double check)
    if (conversation.cliente_id !== user.id && conversation.prestador_id !== user.id) {
        redirect('/chat')
    }

    // Identify the other user
    const isMeClient = conversation.cliente_id === user.id
    const otherUser = isMeClient ? conversation.prestador : conversation.cliente

    // Fetch Messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })

    return (
        <div className="container max-w-2xl py-8 space-y-4">
            <Link
                href="/chat"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar para Conversas
            </Link>

            <div className="flex items-center gap-4 py-4 border-b border-white/10">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
                    {otherUser?.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={otherUser.foto_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-5 w-5 text-gray-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{otherUser?.nome_completo || 'Usuário'}</h2>
                    <p className="text-sm text-gray-400">
                        {conversation.tipo_conversa === 'pedido' ? 'Negociação' : 'Chat'}
                    </p>
                </div>
            </div>

            <ChatInterface
                conversationId={conversation.id}
                userId={user.id}
                initialMessages={messages || []}
            />
        </div>
    )
}
