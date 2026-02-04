'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { joinConversation, leaveConversation } from '../admin-chat-actions'
import { Loader2 } from 'lucide-react'

interface JoinLeaveButtonProps {
    conversationId: string
    isParticipating: boolean
}

export function JoinLeaveButton({ conversationId, isParticipating }: JoinLeaveButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const result = isParticipating
            ? await leaveConversation(conversationId)
            : await joinConversation(conversationId)

        if (result.error) {
            alert(result.error)
        }
        setLoading(false)
    }

    return (
        <Button
            size="sm"
            variant={isParticipating ? 'outline' : 'default'}
            onClick={handleToggle}
            disabled={loading}
            className="text-xs"
        >
            {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : isParticipating ? (
                'Sair'
            ) : (
                'Entrar'
            )}
        </Button>
    )
}
