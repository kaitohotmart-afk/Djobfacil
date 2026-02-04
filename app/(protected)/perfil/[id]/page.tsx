import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ServiceCard } from '../../servicos/_components/service-card'
import { ProductCard } from '../../marketplace/_components/product-card'
import { ContactButton } from '../_components/contact-button'
import { ReviewModal } from '../../reviews/_components/review-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Package, Briefcase, User, Star, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getUserRating } from '../../reviews/actions'
import { getPortfolioItems } from '../../conta/portfolio/actions'

interface ProfilePageProps {
    params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch user details
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !user) {
        notFound()
    }

    // Get current user to check owner
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Fetch Services
    const { data: services } = await supabase
        .from('services')
        .select('*, author:users(*)')
        .eq('user_id', id)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(6)

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*, author:users(*)')
        .eq('user_id', id)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(6)

    // Fetch Rating
    const { average, count } = await getUserRating(id)

    // Fetch Portfolio
    const portfolioItems = await getPortfolioItems(id)

    const isOwner = currentUser?.id === user.id

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header / Profile Info */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 mb-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-800 shadow-2xl">
                            {user.foto_url ? (
                                <img
                                    src={user.foto_url}
                                    alt={user.nome_completo}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-600 bg-slate-900">
                                    <User className="h-16 w-16" />
                                </div>
                            )}
                        </div>
                        {isOwner && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <span className="text-white font-medium text-sm">Editar</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{user.nome_completo}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                                    {user.tipo_conta === 'prestador' ? 'Prestador de Serviços' :
                                        user.tipo_conta === 'cliente' ? 'Cliente' : 'Cliente & Prestador'}
                                </Badge>

                                {count > 0 && (
                                    <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
                                        <Star className="h-3.5 w-3.5 mr-1.5 fill-amber-400" />
                                        {average} ({count} avaliações)
                                    </Badge>
                                )}

                                <div className="flex items-center text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                                    {user.cidade}, {user.provincia}
                                </div>
                                <div className="flex items-center text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                                    Membro desde {format(new Date(user.created_at), 'MMMM yyyy', { locale: ptBR })}
                                </div>
                            </div>
                            <p className="text-slate-300 max-w-2xl leading-relaxed text-lg">
                                {user.bio || "Este usuário ainda não escreveu uma biografia."}
                            </p>
                        </div>

                        {!isOwner && (
                            <div className="pt-2 flex flex-wrap gap-3">
                                <ContactButton targetUserId={user.id} targetUserName={user.nome_completo} />
                                <ReviewModal avaliadoId={user.id} avaliadoNome={user.nome_completo} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
                {/* Services */}
                {services && services.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Briefcase className="h-6 w-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Serviços Oferecidos</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    currentUserId={currentUser?.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Products */}
                {products && products.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Package className="h-6 w-6 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Produtos à Venda</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    currentUserId={currentUser?.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Portfolio */}
                {portfolioItems && portfolioItems.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <ImageIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Portfólio</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolioItems.map((item) => (
                                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group hover:border-purple-500/50 transition-all">
                                    <div className="aspect-video relative bg-slate-950 overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.titulo}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="font-bold text-white truncate text-lg mb-1">{item.titulo}</h3>
                                            {item.descricao && (
                                                <p className="text-xs text-slate-300 line-clamp-2">{item.descricao}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(!services?.length && !products?.length && !portfolioItems?.length) && (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                            <User className="h-8 w-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Nenhum item publicado</h3>
                        <p className="text-slate-500">Este usuário ainda não publicou serviços, produtos ou portfólio.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
