import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { GlobalPresence } from '@/components/global-presence'

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="flex-1 pb-16 md:pb-0">
                {children}
            </div>
            <GlobalPresence userId={user.id} />
            <BottomNav />
        </div>
    )
}
