'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reviewSchema = z.object({
    avaliado_id: z.string().uuid(),
    nota: z.coerce.number().min(1).max(5),
    comentario: z.string().max(500).optional(),
    pedido_id: z.string().uuid().optional(),
    servico_id: z.string().uuid().optional(),
})

export async function createReview(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        avaliado_id: formData.get('avaliado_id'),
        nota: formData.get('nota'),
        comentario: formData.get('comentario'),
        pedido_id: formData.get('pedido_id'),
        servico_id: formData.get('servico_id'),
    }

    const validation = reviewSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: 'Dados inválidos. Verifique os campos.' }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Você precisa estar logado para avaliar.' }
    }

    if (user.id === validation.data.avaliado_id) {
        return { error: 'Você não pode se auto-avaliar.' }
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            avaliador_id: user.id,
            ...validation.data
        })

    if (error) {
        console.error('Error creating review:', error)
        return { error: 'Erro ao salvar avaliação.' }
    }

    revalidatePath(`/perfil/${validation.data.avaliado_id}`)
    revalidatePath('/servicos')
    return { success: true }
}

export async function getUserRating(userId: string) {
    const supabase = await createClient()

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('nota')
        .eq('avaliado_id', userId)

    if (error || !reviews || reviews.length === 0) {
        return { average: 0, count: 0 }
    }

    const total = reviews.reduce((acc, curr) => acc + curr.nota, 0)
    const average = total / reviews.length

    return {
        average: Number(average.toFixed(1)),
        count: reviews.length
    }
}
