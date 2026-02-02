'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Loader2 } from 'lucide-react'
import { startServiceConversation } from '../chat-actions'
import { toast } from 'sonner'

export function StartServiceButton({ serviceId, disabled }: { serviceId: string, disabled: boolean }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleStart = async () => {
        setIsLoading(true)
        try {
            const result = await startServiceConversation(serviceId)
            if (result?.error) {
                toast.error(result.error)
                setIsLoading(false)
            }
            // Redirect handles the rest
        } catch (error) {
            // Ignore NEXT_REDIRECT
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                return
            }
            toast.error('Erro ao iniciar conversa.')
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleStart}
            disabled={disabled || isLoading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 text-lg px-8 py-6 h-auto transition-all hover:scale-105"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <MessageSquare className="mr-2 h-5 w-5" />
            )}
            Negociar Serviço
        </Button>
    )
}
