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
        .select('user_id, tipo')
        .eq('id', requestId)
        .single()

    if (!request) {
        return { error: 'Pedido não encontrado.' }
    }

    if (request.user_id === user.id) {
        return { error: 'Você não pode iniciar uma conversa com você mesmo.' }
    }

    // Determine conversation type and system message based on request type
    const isDigital = request.tipo === 'digital'
    const conversationType = isDigital ? 'servico_digital' : 'pedido'
    const systemMessage = isDigital ? AVISOS_CHAT.servico_digital : AVISOS_CHAT.pedido

    // 3. Check if conversation already exists
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('tipo_conversa', conversationType)
        .eq('relacionado_id', requestId)
        .eq('prestador_id', user.id)
        .eq('cliente_id', request.user_id)
        .single()

    if (existingConv) {
        redirect(`/chat/${existingConv.id}`)
    }

    // 4. Create new conversation
    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
            tipo_conversa: conversationType,
            relacionado_id: requestId,
            cliente_id: request.user_id,
            prestador_id: user.id,
            status: 'ativa',
            admin_participante: false
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        return { error: 'Erro ao iniciar conversa.' }
    }

    // 5. Send system message
    await supabase.from('messages').insert({
        conversation_id: newConv.id,
        tipo_mensagem: isDigital ? 'aviso' : 'sistema',
        content: systemMessage
    })

    redirect(`/chat/${newConv.id}`)
}
