'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserStatus(userId: string, status: 'ativo' | 'suspenso' | 'bloqueado') {
    const supabase = await createClient()

    // Verify admin permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autorizado' }

    const { data: adminUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (adminUser?.role !== 'admin') {
        return { error: 'Permissão negada' }
    }

    // Update user status
    const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)

    if (error) {
        return { error: 'Erro ao atualizar status' }
    }

    revalidatePath('/admin/usuarios')
    return { success: true }
}
