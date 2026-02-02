'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    if (!content.trim()) return { error: 'Mensagem vazia' }

    // Insert message
    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            tipo_mensagem: 'normal'
        })

    if (error) {
        console.error('Error sending message:', error)
        return { error: 'Erro ao enviar mensagem' }
    }

    // Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

    revalidatePath(`/chat/${conversationId}`)
    return { success: true }
}
