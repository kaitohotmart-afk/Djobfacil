'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceSchema, CreateServiceFormData } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createService(data: CreateServiceFormData) {
    const supabase = await createClient()

    // Validate input
    const result = createServiceSchema.safeParse(data)
    if (!result.success) {
        return { error: 'Dados inválidos. Verifique o formulário.' }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Você precisa estar logado para anunciar um serviço.' }
    }

    // Insert service
    const { error } = await supabase
        .from('services')
        .insert({
            user_id: user.id,
            titulo: result.data.titulo,
            descricao: result.data.descricao,
            categoria: result.data.categoria,
            provincia: result.data.provincia,
            cidade: result.data.cidade,
            tipo: result.data.tipo,
            status: 'ativo'
        })

    if (error) {
        console.error('Error creating service:', error)
        return { error: 'Erro ao criar serviço. Tente novamente.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/servicos')
    redirect('/servicos')
}
