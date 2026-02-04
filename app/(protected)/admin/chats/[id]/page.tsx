import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatInterface } from '@/app/(protected)/chat/_components/chat-interface'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, ChevronLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { SendWarningDialog } from '../_components/send-warning-dialog'
import { JoinLeaveButton } from '../_components/join-leave-button'

export default async function AdminChatViewPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify admin role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') redirect('/dashboard')

    // Fetch Conversation
    const { data: conversation } = await supabase
        .from('conversations')
        .select(`
      *,
      cliente:users!conversations_cliente_id_fkey(id, nome_completo, foto_url, email),
      prestador:users!conversations_prestador_id_fkey(id, nome_completo, foto_url, email)
    `)
        .eq('id', id)
        .single()

    if (!conversation) notFound()

    const cliente = Array.isArray(conversation.cliente) ? conversation.cliente[0] : conversation.cliente
    const prestador = Array.isArray(conversation.prestador) ? conversation.prestador[0] : conversation.prestador

    // Fetch Messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <Link
                href="/admin/chats"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar para Painel
            </Link>

            {/* Conversation Header */}
            <Card className="bg-slate-900/50 border-white/10 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <Shield className="h-10 w-10 text-blue-400" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-white">Chat Administrativo</h1>
                                <Badge variant={conversation.admin_participante ? 'info' : 'secondary'}>
                                    {conversation.admin_participante ? 'Participando' : 'Observando'}
                                </Badge>
                                <Badge variant={conversation.status === 'ativa' ? 'success' : 'secondary'}>
                                    {conversation.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Cliente:</p>
                                    <p className="text-white font-medium">{cliente?.nome_completo || 'N/A'}</p>
                                    <p className="text-gray-500 text-xs">{cliente?.email || ''}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Prestador:</p>
                                    <p className="text-white font-medium">{prestador?.nome_completo || 'N/A'}</p>
                                    <p className="text-gray-500 text-xs">{prestador?.email || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <SendWarningDialog conversationId={conversation.id} />
                        <JoinLeaveButton
                            conversationId={conversation.id}
                            isParticipating={conversation.admin_participante}
                        />
                    </div>
                </div>
            </Card>

            {/* Chat Interface */}
            <ChatInterface
                conversationId={conversation.id}
                userId={user.id}
                initialMessages={messages || []}
            />

            {/* Info Note */}
            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-200">
                        <p className="font-medium mb-1">Modo Administrador</p>
                        <p className="text-blue-300/80">
                            {conversation.admin_participante
                                ? 'Você está participando desta conversa. Suas mensagens aparecerão com badge de admin para os usuários.'
                                : 'Clique em "Entrar" para participar da conversa e enviar mensagens.'
                            }
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
