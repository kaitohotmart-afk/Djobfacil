import { createClient } from '@/lib/supabase/server'
import { CATEGORIAS_PRODUTOS, PROVINCIAS } from '@/lib/constants'
import { ProductCard } from './_components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, ShoppingBag, Search, FilterX, AlertTriangle, ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function MarketplacePage(props: {
    searchParams: Promise<{
        categoria?: string
        provincia?: string
        search?: string
    }>
}) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })

    // Filters
    if (searchParams.categoria && searchParams.categoria !== 'todas') {
        query = query.eq('categoria', searchParams.categoria)
    }
    if (searchParams.provincia && searchParams.provincia !== 'todas') {
        query = query.eq('provincia', searchParams.provincia)
    }
    if (searchParams.search) {
        query = query.ilike('titulo', `%${searchParams.search}%`)
    }

    const { data: products, error } = await query

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <ShoppingBag className="h-10 w-10 text-blue-500" />
                            Marketplace
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Compre e venda produtos em toda Moçambique com segurança.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-xl shadow-lg shadow-blue-900/40 transition-all font-semibold">
                        <Link href="/marketplace/novo">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Vender Produto
                        </Link>
                    </Button>
                </div>

                {/* Security Warning */}
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="p-3 bg-amber-500/20 rounded-full shrink-0">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="font-bold text-amber-200">Atenção: Negocie com Segurança</h3>
                        <p className="text-amber-200/70 text-sm">
                            A plataforma não intermedia pagamentos de produtos físicos. Encontre-se em locais públicos e verifique o produto antes de pagar.
                        </p>
                    </div>
                </div>

                {/* Search and Filters Bar */}
                <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-2xl backdrop-blur-md sticky top-6 z-10 shadow-xl border-white/5">
                    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                name="search"
                                placeholder="O que você procura?"
                                defaultValue={searchParams.search}
                                className="pl-10 bg-black/20 border-slate-700 focus:bg-black/40 text-white placeholder:text-slate-500 transition-all h-11"
                            />
                        </div>

                        {/* Category */}
                        <Select name="categoria" defaultValue={searchParams.categoria || 'todas'}>
                            <SelectTrigger className="bg-black/20 border-slate-700 text-white h-11">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="todas">Todas Categorias</SelectItem>
                                {CATEGORIAS_PRODUTOS.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Province */}
                        <Select name="provincia" defaultValue={searchParams.provincia || 'todas'}>
                            <SelectTrigger className="bg-black/20 border-slate-700 text-white h-11">
                                <SelectValue placeholder="Província" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="todas">Todas Províncias</SelectItem>
                                {PROVINCIAS.map(prov => (
                                    <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold h-11 border border-blue-500/20">
                                Filtrar
                            </Button>
                            {(searchParams.categoria || searchParams.provincia || searchParams.search) && (
                                <Button variant="ghost" asChild className="h-11 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                    <Link href="/marketplace">
                                        <FilterX className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Products Grid */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-bold text-slate-300">Produtos Disponíveis</h2>
                        <span className="text-sm text-slate-500">{products?.length || 0} resultados</span>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-6 bg-slate-800/50 rounded-full">
                                <ShoppingCart className="h-12 w-12 text-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Nenhum produto encontrado</h3>
                                <p className="text-slate-500 max-w-sm">
                                    Tente ajustar seus filtros para encontrar o que procura ou seja o primeiro a anunciar nesta categoria.
                                </p>
                            </div>
                            <Button asChild variant="outline" className="mt-4 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                <Link href="/marketplace/novo">Começar a Vender</Link>
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
