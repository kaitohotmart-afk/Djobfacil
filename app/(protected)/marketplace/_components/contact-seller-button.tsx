'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { startProductConversation } from '../chat-actions'
import { toast } from 'sonner'

interface ContactSellerButtonProps {
    productId: string
    disabled?: boolean
}

export function ContactSellerButton({ productId, disabled }: ContactSellerButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleStartChat = async () => {
        setLoading(true)
        try {
            const result = await startProductConversation(productId)
            if (result?.error) {
                toast.error(result.error)
            }
        } catch (error) {
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                // Redirection is expected
                return
            }
            toast.error('Erro ao iniciar chat. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleStartChat}
            disabled={loading || disabled}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40"
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
                <MessageCircle className="h-5 w-5 mr-2" />
            )}
            {loading ? 'Iniciando Conversa...' : 'Contactar Vendedor'}
        </Button>
    )
}
