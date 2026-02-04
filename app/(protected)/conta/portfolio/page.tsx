import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortfolioManager } from './portfolio-manager'
import { getPortfolioItems } from './actions'

export default async function PortfolioPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const items = await getPortfolioItems(user.id)

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold text-white mb-2">Meu Portfólio</h1>
            <p className="text-slate-400 mb-8">Gerencie as fotos dos seus trabalhos realizados.</p>

            <PortfolioManager initialItems={items || []} />
        </div>
    )
}
