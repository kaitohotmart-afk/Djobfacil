import { createClient } from '@/lib/supabase/server'
import { ChatInterface } from '../_components/chat-interface'
import { UserPresence } from '@/components/user-presence'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Conversation
    const { data: conversation } = await supabase
        .from('conversations')
        .select(`
      *,
      cliente:users!conversations_cliente_id_fkey(id, nome_completo, foto_url, role),
      prestador:users!conversations_prestador_id_fkey(id, nome_completo, foto_url, role)
    `)
        .eq('id', id)
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
        .select('*, sender:users(role), proposal:proposals(*)')
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

            <Link href={`/perfil/${otherUser?.id}`} className="flex items-center gap-4 py-4 border-b border-white/10 hover:bg-white/5 transition-colors rounded-lg px-2 -mx-2 group">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-colors relative">
                    {otherUser?.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={otherUser.foto_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-5 w-5 text-gray-400" />
                    )}
                    <UserPresence userId={otherUser?.id} className="absolute bottom-0 right-0" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{otherUser?.nome_completo || 'Usuário'}</h2>
                    <p className="text-sm text-gray-400">
                        {conversation.tipo_conversa === 'pedido' ? 'Negociação' : 'Chat'} • <span className="text-xs text-blue-400">Ver Perfil</span>
                    </p>
                </div>
            </Link>

            <ChatInterface
                conversationId={conversation.id}
                userId={user.id}
                initialMessages={messages || []}
                otherUser={otherUser}
            />
        </div>
    )
}
