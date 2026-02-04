'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function joinConversation(conversationId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    // Check if user is admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Acesso negado' }
    }

    // Update conversation to mark admin as participant
    const { error } = await supabase
        .from('conversations')
        .update({ admin_participante: true })
        .eq('id', conversationId)

    if (error) {
        console.error('Error joining conversation:', error)
        return { error: 'Erro ao entrar na conversa' }
    }

    revalidatePath('/admin/chats')
    revalidatePath(`/admin/chats/${conversationId}`)
    return { success: true }
}

export async function leaveConversation(conversationId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    // Check if user is admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Acesso negado' }
    }

    // Update conversation to remove admin participation
    const { error } = await supabase
        .from('conversations')
        .update({ admin_participante: false })
        .eq('id', conversationId)

    if (error) {
        console.error('Error leaving conversation:', error)
        return { error: 'Erro ao sair da conversa' }
    }

    revalidatePath('/admin/chats')
    revalidatePath(`/admin/chats/${conversationId}`)
    return { success: true }
}

export async function sendAdminMessage(conversationId: string, content: string, tipo: 'admin' | 'aviso' = 'admin') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    // Check if user is admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        return { error: 'Acesso negado' }
    }

    if (!content.trim()) return { error: 'Mensagem vazia' }

    // Insert admin message
    const { error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            tipo_mensagem: tipo
        })

    if (error) {
        console.error('Error sending admin message:', error)
        return { error: 'Erro ao enviar mensagem' }
    }

    // Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

    revalidatePath(`/admin/chats/${conversationId}`)
    return { success: true }
}
