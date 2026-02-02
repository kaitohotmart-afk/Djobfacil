'use server'

import { createClient } from '@/lib/supabase/server'
import { createRequestSchema, CreateRequestFormData } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRequest(data: CreateRequestFormData) {
    const supabase = await createClient()

    // Validate input
    console.log('Validating data in createRequest:', data)
    const result = createRequestSchema.safeParse(data)
    if (!result.success) {
        console.error('Validation failed:', result.error.format())
        return { error: 'Dados inválidos. Verifique o formulário.' }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error('Auth error or no user:', authError)
        return { error: 'Você precisa estar logado para criar um pedido.' }
    }
    console.log('User authenticated:', user.id)

    // Insert request
    const { error } = await supabase
        .from('requests')
        .insert({
            user_id: user.id,
            titulo: result.data.titulo,
            descricao: result.data.descricao,
            categoria: result.data.categoria,
            tipo: result.data.tipo,
            provincia: result.data.provincia,
            cidade: result.data.cidade,
            bairro: result.data.bairro,
            data_desejada: result.data.data_desejada,
            horario: result.data.horario,
            prazo_entrega: result.data.prazo_entrega,
            referencia_link: result.data.referencia_link,
            urgente: result.data.urgente,
            status: 'ativo'
        })

    console.log('Insert result error:', error)

    if (error) {
        console.error('Error creating request:', error)
        return { error: 'Erro ao criar pedido. Tente novamente.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/pedidos')
    redirect('/pedidos')
}
