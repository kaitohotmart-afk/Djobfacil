import { createClient } from '@/lib/supabase/server'
import { CATEGORIAS_SERVICOS, PROVINCIAS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, FilterX, Briefcase, MapPin } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ServiceCard } from './_components/service-card'

export default async function ServicesPage(props: {
    searchParams: Promise<{
        q?: string
        categoria?: string
        provincia?: string
        tipo?: string
        cidade?: string
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
    const cityFilter = searchParams.cidade || ''

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

    if (cityFilter) {
        dbQuery = dbQuery.ilike('cidade', `%${cityFilter}%`)
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
                <Card className="bg-[#1E293B]/50 border-slate-800 backdrop-blur-sm shadow-xl sticky top-6 z-10 border-white/5">
                    <CardContent className="p-6 space-y-4">
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Search */}
                                <div className="md:col-span-4 relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        name="q"
                                        placeholder="Buscar serviços..."
                                        defaultValue={query}
                                        className="pl-9 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Category */}
                                <div className="md:col-span-3">
                                    <Select name="categoria" defaultValue={categoryFilter}>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-11 focus:border-blue-500 transition-all">
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

                                {/* Province */}
                                <div className="md:col-span-3">
                                    <Select name="provincia" defaultValue={provinceFilter}>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-11 focus:border-blue-500 transition-all">
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

                                {/* Type */}
                                <div className="md:col-span-2">
                                    <Select name="tipo" defaultValue={typeFilter}>
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 h-11 focus:border-blue-500 transition-all w-full">
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="local">Local (Presencial)</SelectItem>
                                            <SelectItem value="digital">Digital (Remoto)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* City/Bairro refinement */}
                                <div className="flex-1 relative group">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        name="cidade"
                                        placeholder="Cidade ou Bairro específico (ex: Zimpeto, Matola...)"
                                        defaultValue={cityFilter}
                                        className="pl-9 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 md:px-8 shadow-lg shadow-blue-900/40 flex-1 sm:flex-none">
                                        Filtrar Serviços
                                    </Button>
                                    {(query || categoryFilter !== 'todos' || provinceFilter !== 'todas' || typeFilter !== 'todos' || cityFilter) && (
                                        <Button variant="ghost" size="icon" asChild className="h-11 w-11 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-slate-800">
                                            <Link href="/servicos">
                                                <FilterX className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
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
