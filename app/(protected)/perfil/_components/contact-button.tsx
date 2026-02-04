'use client'

import { useState, useTransition } from 'react'
import { startDirectConversation } from '../../chat/actions'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ContactButton({ targetUserId, targetUserName }: { targetUserId: string, targetUserName: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleClick = () => {
        startTransition(async () => {
            const result = await startDirectConversation(targetUserId)
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success && result.conversationId) {
                router.push(`/chat/${result.conversationId}`)
            }
        })
    }

    return (
        <Button
            onClick={handleClick}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Abrindo Chat...
                </>
            ) : (
                <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                </>
            )}
        </Button>
    )
}
