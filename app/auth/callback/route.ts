import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange code for session (as user)
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Error exchanging code for session:', error)
            return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
        }

        if (data.user) {
            // Use admin client to bypass RLS for checking/creating user profile
            const adminSupabase = createAdminClient()

            // Check if user exists in users table
            const { data: existingUser } = await adminSupabase
                .from('users')
                .select('id, perfil_completo')
                .eq('id', data.user.id)
                .single()

            // If user doesn't exist, create them
            if (!existingUser) {
                const { error: insertError } = await adminSupabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email: data.user.email!,
                        nome_completo: data.user.user_metadata.full_name || data.user.email!.split('@')[0],
                        password_hash: '', // Empty for OAuth users
                        tipo_conta: 'ambos',
                        termos_aceitos: true,
                        perfil_completo: false, // Needs to complete profile
                        role: 'user',
                        status: 'ativo',
                    })

                if (insertError) {
                    console.error('Error creating user:', insertError)
                    return NextResponse.redirect(`${origin}/login?error=user_creation_failed`)
                }

                // Redirect to complete profile for new OAuth users
                return NextResponse.redirect(`${origin}/completar-perfil`)
            }

            // If user exists but profile is incomplete
            if (existingUser && !existingUser.perfil_completo) {
                return NextResponse.redirect(`${origin}/completar-perfil`)
            }
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/dashboard`)
}

