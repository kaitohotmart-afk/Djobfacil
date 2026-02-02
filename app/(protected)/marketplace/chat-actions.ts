'use server'

import { createClient } from '@/lib/supabase/server'
import { AVISOS_CHAT } from '@/lib/constants'
import { redirect } from 'next/navigation'

export async function startProductConversation(productId: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Você precisa estar logado para iniciar uma conversa.' }
    }

    // Get product and owner details
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('*, user_id')
        .eq('id', productId)
        .single()

    if (productError || !product) {
        return { error: 'Produto não encontrado.' }
    }

    // Verify if user is not the owner
    if (product.user_id === user.id) {
        return { error: 'Você não pode iniciar uma conversa sobre seu próprio produto.' }
    }

    // Check if conversation already exists for this product between these users
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('relacionado_id', productId)
        .eq('cliente_id', user.id)
        .eq('tipo_conversa', 'produto')
        .single()

    if (existingConv) {
        redirect(`/chat/${existingConv.id}`)
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
            tipo_conversa: 'produto',
            relacionado_id: productId,
            cliente_id: user.id,
            prestador_id: product.user_id,
            status: 'ativa',
            admin_participante: false
        })
        .select()
        .single()

    if (convError || !newConv) {
        console.error('Conv Error:', convError)
        return { error: 'Erro ao iniciar conversa.' }
    }

    // Send initial system warning message
    const { error: msgError } = await supabase
        .from('messages')
        .insert({
            conversation_id: newConv.id,
            sender_id: null,
            tipo_mensagem: 'aviso',
            content: AVISOS_CHAT.produto
        })

    if (msgError) {
        console.error('Message Warning Error:', msgError)
    }

    redirect(`/chat/${newConv.id}`)
}
