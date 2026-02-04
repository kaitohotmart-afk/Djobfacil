'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import { sendAdminMessage } from '../admin-chat-actions'
import { AVISOS_CHAT } from '@/lib/constants'

interface SendWarningDialogProps {
    conversationId: string
}

const WARNING_TEMPLATES = {
    seguranca_geral: `⚠️ Aviso de Segurança

Por favor, respeite as regras da plataforma e mantenha todas as negociações dentro do chat.

Evite compartilhar informações pessoais como números de telefone, endereços ou dados bancários fora do sistema de pagamento oficial.

Qualquer problema, entre em contato com o suporte.`,

    pagamento: `⚠️ Aviso - Pagamento

Lembre-se: pagamentos de serviços digitais devem ser feitos exclusivamente através da plataforma (taxa de 10%).

Não faça transferências diretas ou use métodos de pagamento externos. A plataforma oferece proteção para ambas as partes.`,

    comportamento: `⚠️ Advertência de Comportamento

Identificamos possível violação das regras de conduta.

Mantenha a comunicação respeitosa e profissional. Linguagem ofensiva, ameaças ou assédio resultarão em suspensão da conta.

Este é um aviso formal.`,
}

export function SendWarningDialog({ conversationId }: SendWarningDialogProps) {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState(WARNING_TEMPLATES.seguranca_geral)
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        setLoading(true)
        const result = await sendAdminMessage(conversationId, content, 'aviso')

        if (result.error) {
            alert(result.error)
        } else {
            setOpen(false)
            setContent(WARNING_TEMPLATES.seguranca_geral)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="warning" size="sm" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Enviar Aviso
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Enviar Aviso de Segurança</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="text-gray-300 mb-2 block">Template</Label>
                        <div className="grid grid-cols- gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setContent(WARNING_TEMPLATES.seguranca_geral)}
                            >
                                Segurança Geral
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setContent(WARNING_TEMPLATES.pagamento)}
                            >
                                Pagamento
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setContent(WARNING_TEMPLATES.comportamento)}
                            >
                                Comportamento
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setContent(AVISOS_CHAT.servico_digital)}
                            >
                                Serviço Digital
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="warning-content" className="text-gray-300 mb-2 block">
                            Mensagem (editável)
                        </Label>
                        <textarea
                            id="warning-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-48 bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 resize-none"
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {content.length}/1000 caracteres
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="warning"
                            onClick={handleSend}
                            disabled={loading || !content.trim()}
                        >
                            {loading ? 'Enviando...' : 'Enviar Aviso'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
