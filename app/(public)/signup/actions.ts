'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function signUp(data: SignupFormData) {
    const supabase = await createClient()

    // Validate input
    const result = signupSchema.safeParse(data)
    if (!result.success) {
        return { error: 'Dados inválidos. Verifique o formulário.' }
    }

    try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: result.data.email,
            password: result.data.password,
            options: {
                data: {
                    nome_completo: result.data.nome_completo,
                }
            }
        })

        if (authError) {
            if (authError.message.includes('User already registered')) {
                // If user already exists in Auth, check if they have a profile in public.users
                const { data: existingUser } = await supabase.auth.signInWithPassword({
                    email: result.data.email,
                    password: result.data.password,
                })

                if (existingUser.user) {
                    const adminSupabase = createAdminClient()

                    // Check if profile exists
                    const { data: profile } = await adminSupabase
                        .from('users')
                        .select('id')
                        .eq('id', existingUser.user.id)
                        .single()

                    if (!profile) {
                        // Profile missing, try to create it
                        const { error: insertError } = await adminSupabase.from('users').insert({
                            id: existingUser.user.id,
                            email: result.data.email,
                            password_hash: 'managed_by_supabase_auth',
                            nome_completo: result.data.nome_completo,
                            provincia: result.data.provincia,
                            cidade: result.data.cidade,
                            bairro: result.data.bairro || null,
                            tipo_conta: result.data.tipo_conta,
                            termos_aceitos: true,
                            perfil_completo: true, // Manual signup provides all info
                        })
                        if (insertError) throw insertError
                        return { success: true }
                    }
                }
            }
            throw authError
        }

        if (!authData.user) throw new Error('Falha ao criar usuário')

        // Create public profile using Admin Client to bypass RLS
        const adminSupabase = createAdminClient()
        const { error: dbError } = await adminSupabase.from('users').insert({
            id: authData.user.id,
            email: result.data.email,
            password_hash: 'managed_by_supabase_auth',
            nome_completo: result.data.nome_completo,
            provincia: result.data.provincia,
            cidade: result.data.cidade,
            bairro: result.data.bairro || null,
            tipo_conta: result.data.tipo_conta,
            termos_aceitos: true,
            perfil_completo: true, // Manual signup provides all info
        })

        if (dbError) throw dbError

        revalidatePath('/dashboard')
        return { success: true }
    } catch (err: any) {
        console.error('Error in signUp action:', err)
        return { error: err.message || 'Erro ao criar conta.' }
    }
}
