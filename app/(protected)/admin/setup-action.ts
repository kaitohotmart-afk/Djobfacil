'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function promoteToAdmin(email?: string) {
    const supabase = await createClient()

    let targetEmail = email

    if (!targetEmail) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'Não autenticado' }
        targetEmail = user.email
    }

    if (!targetEmail) return { error: 'Email não encontrado' }

    // Update the user's role to admin
    const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('email', targetEmail)

    if (error) {
        console.error('Error promoting user:', error)
        return { error: 'Erro ao promover usuário. Verifique RLS.' }
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}

/**
 * Specifically promote a user by email
 */
export async function promoteEmailToAdmin(email: string) {
    return await promoteToAdmin(email)
}
