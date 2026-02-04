import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MessageSquare, Users, Shield, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { JoinLeaveButton } from './_components/join-leave-button'

export default async function AdminChatsPage() {
    const supabase = await createClient()

    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') redirect('/dashboard')

    // Fetch all digital service conversations
    const { data: conversations } = await supabase
        .from('conversations')
        .select(`
      id,
      tipo_conversa,
      status,
      admin_participante,
      created_at,
      updated_at,
      cliente:users!conversations_cliente_id_fkey(id, nome_completo, email),
      prestador:users!conversations_prestador_id_fkey(id, nome_completo, email)
    `)
        .eq('tipo_conversa', 'servico_digital')
        .order('updated_at', { ascending: false })

    // Get message counts
    const conversationsWithStats = await Promise.all(
        (conversations || []).map(async (conv) => {
            const { count: totalMessages } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conv.id)

            return { ...conv, totalMessages: totalMessages || 0 }
        })
    )

    // Calculate stats
    const totalChats = conversationsWithStats.length
    const activeChats = conversationsWithStats.filter(c => c.status === 'ativa').length
    const withAdmin = conversationsWithStats.filter(c => c.admin_participante).length
    const closedChats = conversationsWithStats.filter(c => c.status === 'encerrada').length

    return (
        <div className="container max-w-6xl py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Monitoramento de Chats</h1>
                    <p className="text-gray-400">Gerenciar conversas de serviços digitais</p>
                </div>
                <Shield className="h-12 w-12 text-blue-400" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-blue-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Total de Chats</p>
                            <p className="text-2xl font-bold text-white">{totalChats}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <Users className="h-8 w-8 text-green-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Conversas Ativas</p>
                            <p className="text-2xl font-bold text-white">{activeChats}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <Shield className="h-8 w-8 text-blue-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Com Admin</p>
                            <p className="text-2xl font-bold text-white">{withAdmin}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Encerradas</p>
                            <p className="text-2xl font-bold text-white">{closedChats}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Conversations Table */}
            <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50 border-b border-white/10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prestador</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Msgs</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Atualizado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {conversationsWithStats.map((conv) => {
                                const cliente = Array.isArray(conv.cliente) ? conv.cliente[0] : conv.cliente
                                const prestador = Array.isArray(conv.prestador) ? conv.prestador[0] : conv.prestador

                                return (
                                    <tr key={conv.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                            {conv.id.substring(0, 8)}...
                                        </td>
                                        <td className="px-4 py-3 text-sm text-white">
                                            {cliente?.nome_completo || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-white">
                                            {prestador?.nome_completo || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={conv.status === 'ativa' ? 'success' : 'secondary'}>
                                                    {conv.status}
                                                </Badge>
                                                {conv.admin_participante && (
                                                    <Badge variant="info" className="text-[10px]">
                                                        <Shield className="h-2.5 w-2.5 mr-1" />
                                                        Admin
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">
                                            {conv.totalMessages}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">
                                            {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: ptBR })}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/chats/${conv.id}`}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    Ver
                                                </Link>
                                                <JoinLeaveButton
                                                    conversationId={conv.id}
                                                    isParticipating={conv.admin_participante}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {conversationsWithStats.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Nenhuma conversa de serviço digital encontrada.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
