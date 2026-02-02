import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Tag, Calendar, User, ShieldCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ContactSellerButton } from '../_components/contact-seller-button'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

export default async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { data: product, error } = await supabase
        .from('products')
        .select('*, author:user_id(nome_completo, foto_url)')
        .eq('id', params.id)
        .single()

    if (error || !product) {
        notFound()
    }

    const isOwner = currentUser?.id === product.user_id

    const formattedPrice = new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
    }).format(product.preco)

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Breadcrumbs / Back */}
                <Link href="/marketplace" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Image and Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Card */}
                        <Card className="bg-[#1E293B]/50 border-slate-700/50 backdrop-blur-xl overflow-hidden rounded-3xl border-white/5">
                            <div className="relative aspect-video sm:aspect-square md:aspect-video lg:aspect-auto lg:h-[500px] w-full bg-black/40 flex items-center justify-center">
                                {product.foto_url ? (
                                    <img
                                        src={product.foto_url}
                                        alt={product.titulo}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-600">
                                        <Tag className="h-20 w-20 opacity-20 mb-4" />
                                        <span>Sem fotos disponíveis</span>
                                    </div>
                                )}
                                <Badge className="absolute top-6 left-6 bg-blue-600 hover:bg-blue-600 text-white px-4 py-1.5 text-sm border-none shadow-xl">
                                    {product.categoria}
                                </Badge>
                            </div>
                        </Card>

                        {/* Content Details */}
                        <div className="space-y-6 px-2">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                                    {product.titulo}
                                </h1>
                                <div className="flex flex-wrap gap-4 items-center text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span>{product.provincia}, {product.cidade}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        <span>Publicado em {format(new Date(product.created_at), "dd 'de' MMMM", { locale: pt })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-800" />

                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-white uppercase tracking-wider text-sm opacity-50">
                                    Descrição do Produto
                                </h2>
                                <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {product.descricao}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions and Seller Info */}
                    <div className="space-y-6">

                        {/* Price & Action Card */}
                        <Card className="bg-[#1E293B]/80 border-slate-700/50 backdrop-blur-3xl shadow-2xl rounded-3xl sticky top-6">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <span className="text-slate-400 text-sm font-medium">Preço à vista</span>
                                    <div className="text-4xl font-black text-blue-400 tracking-tighter">
                                        {formattedPrice}
                                    </div>
                                </div>

                                {!isOwner ? (
                                    <ContactSellerButton productId={product.id} />
                                ) : (
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                                        <p className="text-slate-300 text-sm">Este é o seu anúncio.</p>
                                        <Button variant="link" asChild className="text-blue-400 py-1 h-auto">
                                            <Link href={`/marketplace/${product.id}/editar`}>Editar Anúncio</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Safety Tips Card */}
                                <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center gap-2 text-amber-500 font-bold">
                                        <ShieldCheck className="h-5 w-5" />
                                        Dicas de Segurança
                                    </div>
                                    <ul className="space-y-3 text-xs text-amber-200/80">
                                        <li className="flex gap-2">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                            Nunca pague adiantado sem ver o produto.
                                        </li>
                                        <li className="flex gap-2">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                            Encontre-se em locais públicos e seguros.
                                        </li>
                                        <li className="flex gap-2">
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                            Verifique o funcionamento antes de concluir.
                                        </li>
                                    </ul>
                                </div>

                                {/* Seller Mini Card */}
                                <div className="pt-6 border-t border-slate-800 space-y-4">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Vendedor</span>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700 overflow-hidden">
                                            {product.author?.foto_url ? (
                                                <img src={product.author.foto_url} alt={product.author.nome_completo} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{product.author?.nome_completo}</p>
                                            <Link href={`/perfil/${product.user_id}`} className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                                                Ver outros anúncios
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}
