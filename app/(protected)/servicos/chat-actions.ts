'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AVISOS_CHAT } from '@/lib/constants'

// Start conversation for a Service
export async function startServiceConversation(serviceId: string) {
    const supabase = await createClient()

    // 1. Get current user (Client)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Você precisa estar logado.' }
    }

    // 2. Get service details (to find Provider and Type)
    const { data: service } = await supabase
        .from('services')
        .select('user_id, tipo')
        .eq('id', serviceId)
        .single()

    if (!service) {
        return { error: 'Serviço não encontrado.' }
    }

    if (service.user_id === user.id) {
        return { error: 'Você não pode contratar seu próprio serviço.' }
    }

    // Determine conversation type
    const convType = service.tipo === 'digital' ? 'servico_digital' : 'servico_local'
    const adminParticipante = service.tipo === 'digital' // Admin joins digital chats

    // 3. Check for existing conversation
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('tipo_conversa', convType)
        .eq('relacionado_id', serviceId)
        .eq('cliente_id', user.id) // Current user is the client
        .eq('prestador_id', service.user_id)
        .single()

    if (existingConv) {
        redirect(`/chat/${existingConv.id}`)
    }

    // 4. Create new conversation
    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
            tipo_conversa: convType,
            relacionado_id: serviceId,
            cliente_id: user.id,
            prestador_id: service.user_id,
            status: 'ativa',
            admin_participante: adminParticipante
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        return { error: 'Erro ao iniciar conversa.' }
    }

    // 5. Send system message with SECURITY WARNING
    const warningMessage = service.tipo === 'digital'
        ? AVISOS_CHAT.servico_digital
        : AVISOS_CHAT.servico_local

    await supabase.from('messages').insert({
        conversation_id: newConv.id,
        tipo_mensagem: 'sistema',
        content: warningMessage
    })

    redirect(`/chat/${newConv.id}`)
}
