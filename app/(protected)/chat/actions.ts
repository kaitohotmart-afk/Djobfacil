'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(
    conversationId: string,
    content: string,
    type: 'normal' | 'sistema' | 'admin' | 'aviso' = 'normal',
    fileUrl?: string,
    fileType?: string
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    if (!content.trim() && !fileUrl) return { error: 'Mensagem vazia' }

    // Insert message
    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            tipo_mensagem: type,
            file_url: fileUrl,
            file_type: fileType
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

export async function markConversationAsRead(conversationId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    // Call the database function to mark all messages as read
    const { error } = await supabase.rpc('mark_conversation_as_read', {
        conv_id: conversationId,
        user_id: user.id
    })

    if (error) {
        console.error('Error marking conversation as read:', error)
        return { error: 'Erro ao marcar como lida' }
    }

    revalidatePath(`/chat/${conversationId}`)
    revalidatePath('/chat')
    return { success: true }
}

export async function startDirectConversation(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Você precisa estar logado.' }
    if (user.id === targetUserId) return { error: 'Você não pode conversar com você mesmo.' }

    // Check existing conversation of type 'direta' between these users
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('tipo_conversa', 'direta')
        .or(`and(cliente_id.eq.${user.id},prestador_id.eq.${targetUserId}),and(cliente_id.eq.${targetUserId},prestador_id.eq.${user.id})`)
        .single()

    if (existing) {
        return { success: true, conversationId: existing.id }
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
            tipo_conversa: 'direta',
            cliente_id: user.id, // Initiator
            prestador_id: targetUserId, // Target
            status: 'ativa'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating direct conversation:', error)
        return { error: 'Erro ao iniciar conversa.' }
    }

    revalidatePath('/chat')
    return { success: true, conversationId: newConv.id }
}
