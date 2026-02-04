'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Você precisa estar logado.' }
    }

    const nome_completo = formData.get('nome_completo') as string
    const bio = formData.get('bio') as string
    const provincia = formData.get('provincia') as string
    const cidade = formData.get('cidade') as string
    const foto_url = formData.get('foto_url') as string // Optional, if handled via client upload

    if (!nome_completo || !provincia || !cidade) {
        return { error: 'Preencha todos os campos obrigatórios.' }
    }

    const updates: any = {
        nome_completo,
        bio,
        provincia,
        cidade,
        updated_at: new Date().toISOString(),
    }

    if (foto_url) {
        updates.foto_url = foto_url
    }

    const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Erro ao atualizar perfil.' }
    }

    revalidatePath('/conta/perfil')
    revalidatePath(`/perfil/${user.id}`)
    return { success: 'Perfil atualizado com sucesso!' }
}
