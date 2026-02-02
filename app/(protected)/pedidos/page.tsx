import { createClient } from '@/lib/supabase/server'
import { RequestCard } from './_components/request-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search, FilterX } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIAS_SERVICOS, PROVINCIAS } from '@/lib/constants'

// Tipagem básica para filtro
interface SearchParams {
    q?: string
    categoria?: string
    provincia?: string
}

export default async function RequestsPage(props: {
    searchParams: Promise<SearchParams>
}) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    // Base query
    let query = supabase
        .from('requests')
        .select(`
      *,
      author:user_id (
        nome_completo,
        foto_url
      )
    `)
        .eq('status', 'ativo')
        // Ordenar urgentes primeiro, depois por data
        .order('urgente', { ascending: false })
        .order('created_at', { ascending: false })

    // Apply filters
    if (searchParams.q) {
        query = query.ilike('titulo', `%${searchParams.q}%`)
    }
    if (searchParams.categoria && searchParams.categoria !== 'todas') {
        query = query.eq('categoria', searchParams.categoria)
    }
    if (searchParams.provincia && searchParams.provincia !== 'todas') {
        query = query.eq('provincia', searchParams.provincia)
    }

    const { data: requests } = await query

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Mural de Pedidos</h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Encontre oportunidades ou publique o que você precisa.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/40 px-8 py-6 rounded-2xl text-lg font-bold group transition-all">
                        <Link href="/pedidos/novo">
                            <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                            Publicar Pedido
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-[#1E293B]/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                    <form className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="relative md:col-span-5">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                            <Input
                                name="q"
                                placeholder="Buscar pedidos por título..."
                                defaultValue={searchParams.q}
                                className="pl-12 bg-slate-950/40 border-slate-700/50 text-white placeholder:text-slate-500 h-12 rounded-2xl focus:ring-blue-500/20"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <select
                                name="categoria"
                                defaultValue={searchParams.categoria}
                                className="flex h-12 w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                            >
                                <option value="todas">Todas Categorias</option>
                                {CATEGORIAS_SERVICOS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-3 flex gap-2">
                            <select
                                name="provincia"
                                defaultValue={searchParams.provincia}
                                className="flex h-12 w-full rounded-2xl border border-slate-700/50 bg-slate-950/40 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                            >
                                <option value="todas">Todas Províncias</option>
                                {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <Button type="submit" className="h-12 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all">
                                Filtrar
                            </Button>
                        </div>

                        <div className="md:col-span-1 flex justify-center items-center">
                            {Object.keys(searchParams).length > 0 && (
                                <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800" title="Limpar filtros">
                                    <Link href="/pedidos"><FilterX className="h-5 w-5" /></Link>
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests?.length === 0 ? (
                        <div className="col-span-full py-24 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 backdrop-blur-sm">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/50 mb-6 shadow-xl border border-white/5">
                                <Search className="h-10 w-10 text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Nenhum pedido encontrado</h3>
                            <p className="text-slate-400 mt-2 max-w-sm mx-auto text-lg leading-relaxed">
                                Tente ajustar seus filtros ou seja o primeiro a publicar nesta categoria.
                            </p>
                            <Button asChild variant="link" className="text-blue-400 mt-6 text-lg hover:text-blue-300">
                                <Link href="/pedidos/novo">Criar novo pedido</Link>
                            </Button>
                        </div>
                    ) : (
                        requests?.map((req) => (
                            <RequestCard key={req.id} request={req} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
