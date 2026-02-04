'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (!password || !confirmPassword) {
        return { error: 'Preencha todos os campos.' }
    }

    if (password.length < 6) {
        return { error: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem.' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        console.error('Error updating password:', error)
        return { error: 'Erro ao atualizar senha. Tente novamente.' }
    }

    return { success: 'Senha atualizada com sucesso!' }
}
