'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ContentType = 'requests' | 'services' | 'products'

export async function updateContentStatus(
    type: ContentType,
    id: string,
    status: 'ativo' | 'inativo' | 'vendido' | 'fechado' | 'removido'
) {
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

    // Update status
    const { error } = await supabase
        .from(type)
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error(`Error updating ${type} status:`, error)
        return { error: 'Erro ao atualizar status' }
    }

    revalidatePath('/admin/conteudo')
    return { success: true }
}
