import { createClient } from '@/lib/supabase/server'
import { CATEGORIAS_SERVICOS, PROVINCIAS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, FilterX, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ServiceCard } from './_components/service-card'

export default async function ServicesPage(props: {
    searchParams: Promise<{
        q?: string
        categoria?: string
        provincia?: string
        tipo?: string
    }>
}) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Search Params
    const query = searchParams.q || ''
    const categoryFilter = searchParams.categoria || 'todos'
    const provinceFilter = searchParams.provincia || 'todas'
    const typeFilter = searchParams.tipo || 'todos'

    // Fetch Services
    let dbQuery = supabase
        .from('services')
        .select('*, author:user_id(nome_completo, foto_url)')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })

    if (categoryFilter !== 'todos') {
        dbQuery = dbQuery.eq('categoria', categoryFilter)
    }

    if (provinceFilter !== 'todas') {
        dbQuery = dbQuery.eq('provincia', provinceFilter)
    }

    if (typeFilter !== 'todos') {
        dbQuery = dbQuery.eq('tipo', typeFilter)
    }

    if (query) {
        dbQuery = dbQuery.ilike('titulo', `%${query}%`)
    }

    const { data: services, error } = await dbQuery

    if (error) {
        console.error('Error fetching services:', error)
    }

    return (
        <div className="min-h-full w-full bg-[#0B1120] text-slate-100 pb-10">
            <div className="container mx-auto px-4 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-blue-500" />
                            Ofertas de Serviços
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Encontre profissionais qualificados para seu projeto.
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20" asChild>
                        <Link href="/servicos/novo">
                            <Plus className="mr-2 h-4 w-4" />
                            Anunciar um Serviço
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card className="bg-[#1E293B]/50 border-slate-800 backdrop-blur-sm">
                    <CardContent className="p-4 space-y-4">
                        <form className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Search */}
                            <div className="md:col-span-4 relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    name="q"
                                    placeholder="Buscar serviços..."
                                    defaultValue={query}
                                    className="pl-9 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-10"
                                />
                            </div>

                            {/* Filters Row */}
                            <div className="md:col-span-3">
                                <Select name="categoria" defaultValue={categoryFilter}>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-10">
                                        <SelectValue placeholder="Categoria" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectItem value="todos">Todas Categorias</SelectItem>
                                        {CATEGORIAS_SERVICOS.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-3">
                                <Select name="provincia" defaultValue={provinceFilter}>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-10">
                                        <SelectValue placeholder="Província" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 max-h-[200px]">
                                        <SelectItem value="todas">Todas Províncias</SelectItem>
                                        {PROVINCIAS.map(prov => (
                                            <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 flex gap-2">
                                <Select name="tipo" defaultValue={typeFilter}>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-10 w-full">
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectItem value="todos">Todos</SelectItem>
                                        <SelectItem value="local">Local (Presencial)</SelectItem>
                                        <SelectItem value="digital">Digital (Remoto)</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button type="submit" variant="secondary" className="px-3">
                                    Filtrar
                                </Button>
                            </div>
                        </form>

                        {(query || categoryFilter !== 'todos' || provinceFilter !== 'todas' || typeFilter !== 'todos') && (
                            <div className="pt-2 border-t border-slate-800 flex justify-end">
                                <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-white">
                                    <Link href="/servicos">
                                        <FilterX className="mr-2 h-3 w-3" />
                                        Limpar Filtros
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results */}
                {services && services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} currentUserId={user.id} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#1E293B]/30 rounded-2xl border border-slate-800 border-dashed">
                        <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-slate-300">Nenhum serviço encontrado</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            Tente ajustar seus filtros ou seja o primeiro a anunciar nessa categoria.
                        </p>
                        <Button variant="link" className="text-blue-400 mt-4" asChild>
                            <Link href="/servicos/novo">Anunciar Serviço</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
