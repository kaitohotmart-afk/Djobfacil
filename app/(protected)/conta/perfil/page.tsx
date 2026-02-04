import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '../_components/profile-form'

export default async function PerfilPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!userData) {
        return <div>Usuário não encontrado</div>
    }

    return (
        <div className="max-w-2xl">
            <ProfileForm user={userData} />
        </div>
    )
}
