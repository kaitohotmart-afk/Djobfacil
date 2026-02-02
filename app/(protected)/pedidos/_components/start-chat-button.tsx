'use client'

import { useState, useTransition } from 'react'
import { startConversation } from '../chat-actions'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function StartChatButton({ requestId, disabled = false }: { requestId: string; disabled?: boolean }) {
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        startTransition(async () => {
            const result = await startConversation(requestId)
            if (result?.error) {
                toast.error(result.error)
            }
        })
    }

    return (
        <Button
            onClick={handleClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            disabled={isPending || disabled}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando Conversa...
                </>
            ) : (
                <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Quero fazer este serviço
                </>
            )}
        </Button>
    )
}
