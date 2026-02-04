'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Shield, AlertTriangle, Check, CheckCheck, FileText, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { updateProposalStatus } from '../../proposals/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Proposal {
    id: string
    description: string
    price: number
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
}

interface Message {
    id: string
    content: string
    sender_id: string | null
    created_at: string
    tipo_mensagem: 'normal' | 'sistema' | 'admin' | 'aviso' | 'proposal'
    lida_por?: string[]
    file_url?: string | null
    file_type?: string | null
    proposal?: Proposal
    type?: string
}

interface MessageBubbleProps {
    message: Message
    isCurrentUser: boolean
    currentUserId: string
    senderRole?: string
}

export function MessageBubble({ message, isCurrentUser, currentUserId, senderRole }: MessageBubbleProps) {
    const isSystemMessage = message.tipo_mensagem === 'sistema'
    const isAdminMessage = message.tipo_mensagem === 'admin' || senderRole === 'admin'
    const isWarningMessage = message.tipo_mensagem === 'aviso'
    const router = useRouter()

    async function handleProposalAction(proposalId: string, status: 'accepted' | 'rejected') {
        const result = await updateProposalStatus(proposalId, status)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(status === 'accepted' ? 'Proposta aceita!' : 'Proposta recusada.')
            router.refresh()
        }
    }

    // System or warning messages (centered)
    if (isSystemMessage || isWarningMessage) {
        return (
            <div className="flex justify-center my-4 px-4">
                <div className={cn(
                    "max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-md border",
                    isWarningMessage
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-slate-800 border-slate-700 text-gray-400"
                )}>
                    <div className="flex items-start gap-2">
                        {isWarningMessage && (
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                        )}
                        <div className="flex-1">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <p className="text-[10px] mt-2 text-right opacity-70">
                                {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Regular messages (left/right aligned)
    const isRead = message.lida_por && message.lida_por.length > 1 // More than just sender

    // Proposal rendering
    if (message.type === 'proposal' && message.proposal) {
        return (
            <div className={cn("flex mb-3 px-4", isCurrentUser ? 'justify-end' : 'justify-start')}>
                <div className={cn("max-w-[85%] sm:max-w-[320px] flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                    <div className={cn(
                        "rounded-lg p-1 text-sm shadow-md overflow-hidden w-full",
                        isCurrentUser
                            ? "bg-green-600 rounded-br-none"
                            : "bg-slate-800 rounded-bl-none"
                    )}>
                        {/* Proposal Card Content */}
                        <div className="bg-white rounded p-4 text-slate-900">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Orçamento
                                </span>
                                <Badge variant={
                                    message.proposal.status === 'accepted' ? 'success' :
                                        message.proposal.status === 'rejected' ? 'destructive' :
                                            message.proposal.status === 'pending' ? 'outline' : 'secondary'
                                } className={cn(
                                    message.proposal.status === 'accepted' && "bg-green-100 text-green-700 border-green-200",
                                    message.proposal.status === 'rejected' && "bg-red-100 text-red-700 border-red-200",
                                    message.proposal.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
                                )}>
                                    {message.proposal.status === 'accepted' ? 'Aceito' :
                                        message.proposal.status === 'rejected' ? 'Recusado' :
                                            message.proposal.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                </Badge>
                            </div>

                            <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{message.proposal.description}</p>

                            <div className="text-2xl font-bold text-slate-900 mb-4">
                                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(message.proposal.price)}
                            </div>

                            {/* Actions for Client (Receiver) */}
                            {!isCurrentUser && message.proposal.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() => handleProposalAction(message.proposal!.id, 'rejected')}
                                    >
                                        Recusar
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleProposalAction(message.proposal!.id, 'accepted')}
                                    >
                                        Aceitar
                                    </Button>
                                </div>
                            )}

                            {/* Status for Sender */}
                            {isCurrentUser && message.proposal.status === 'pending' && (
                                <div className="text-center py-2 bg-slate-50 rounded text-xs text-slate-500 italic">
                                    Aguardando resposta do cliente...
                                </div>
                            )}
                        </div>

                        {/* Timestamp */}
                        <div className={cn("px-2 py-1 flex justify-end", isCurrentUser ? "text-green-100" : "text-gray-400")}>
                            <div className="flex items-center justify-end gap-1">
                                <p className="text-[10px] min-w-[35px] text-right">
                                    {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                                </p>
                                {isCurrentUser && (
                                    <div className="ml-0.5">
                                        {isRead ? (
                                            <CheckCheck className="h-3.5 w-3.5 text-blue-300" />
                                        ) : (
                                            <Check className="h-3.5 w-3.5 text-green-200/70" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex mb-3 px-4", isCurrentUser ? 'justify-end' : 'justify-start')}>
            <div className={cn("max-w-[80%] flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                {/* Admin badge if applicable */}
                {isAdminMessage && !isCurrentUser && (
                    <Badge variant="info" className="mb-1 text-[10px] px-2 py-0">
                        <Shield className="h-3 w-3 mr-1" />
                        Administrador
                    </Badge>
                )}

                {/* Message bubble */}
                <div
                    className={cn(
                        "rounded-lg px-4 py-2 text-sm shadow-md transition-all",
                        isCurrentUser
                            ? "bg-green-600 text-white rounded-br-none"
                            : isAdminMessage
                                ? "bg-blue-600 text-white rounded-bl-none"
                                : "bg-slate-800 text-gray-200 rounded-bl-none"
                    )}
                >
                    {message.file_url ? (
                        <div className="mb-2">
                            {message.file_type === 'image' ? (
                                <div className="relative rounded-lg overflow-hidden max-w-[280px]">
                                    <img
                                        src={message.file_url}
                                        alt="Imagem enviada"
                                        className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(message.file_url!, '_blank')}
                                    />
                                </div>
                            ) : (
                                <a
                                    href={message.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors max-w-[280px]"
                                >
                                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            Arquivo
                                        </p>
                                        <p className="text-xs text-white/70">
                                            Clique para baixar
                                        </p>
                                    </div>
                                    <Download className="h-5 w-5 text-white/70" />
                                </a>
                            )}
                            {message.content && (
                                <p className="whitespace-pre-wrap break-words leading-relaxed mt-2">{message.content}</p>
                            )}
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                    )}

                    {/* Timestamp and read indicator */}
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <p className={cn(
                            "text-[10px] min-w-[35px] text-right",
                            isCurrentUser ? 'text-green-100' : isAdminMessage ? 'text-blue-100' : 'text-gray-500'
                        )}>
                            {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                        </p>
                        {isCurrentUser && (
                            <div className="ml-0.5">
                                {isRead ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-blue-300" />
                                ) : (
                                    <Check className="h-3.5 w-3.5 text-green-200/70" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
