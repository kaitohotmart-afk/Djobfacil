'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AVISOS_CHAT } from '@/lib/constants'

export async function startConversation(requestId: string) {
    const supabase = await createClient()

    // 1. Get current user (Provider)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Você precisa estar logado.' }
    }

    // 2. Get request details to find the client (owner)
    const { data: request } = await supabase
        .from('requests')
        .select('user_id')
        .eq('id', requestId)
        .single()

    if (!request) {
        return { error: 'Pedido não encontrado.' }
    }

    if (request.user_id === user.id) {
        return { error: 'Você não pode iniciar uma conversa com você mesmo.' }
    }

    // 3. Check if conversation already exists
    // Logic: Conversation type='pedido', relacionado_id=requestId, prestador_id=currentUser, cliente_id=requestOwner
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('tipo_conversa', 'pedido')
        .eq('relacionado_id', requestId)
        .eq('prestador_id', user.id) // Current user is the 'prestador' (offering service)
        .eq('cliente_id', request.user_id)
        .single()

    if (existingConv) {
        redirect(`/chat/${existingConv.id}`)
    }

    // 4. Create new conversation
    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
            tipo_conversa: 'pedido',
            relacionado_id: requestId,
            cliente_id: request.user_id,
            prestador_id: user.id,
            status: 'ativa',
            admin_participante: false // Default, admins can join later if flagged
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        return { error: 'Erro ao iniciar conversa.' }
    }

    // 5. Send system message (optional, but good for context)
    await supabase.from('messages').insert({
        conversation_id: newConv.id,
        tipo_mensagem: 'sistema',
        content: AVISOS_CHAT.pedido
    })

    redirect(`/chat/${newConv.id}`)
}
