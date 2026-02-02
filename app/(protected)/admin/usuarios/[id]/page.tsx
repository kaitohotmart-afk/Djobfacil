import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Mail, Calendar, User, Briefcase, FileText, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (!user) notFound()

    // Fetch user content
    const { data: requests } = await supabase.from('requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    const { data: services } = await supabase.from('services').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    const { data: products } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/usuarios">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Perfil do Usuário</h2>
                    <p className="text-slate-500 text-sm">Visualizando informações detalhadas e histórico.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* User Info Sidebar */}
                <Card className="md:col-span-1 bg-slate-900 border-slate-800 shadow-2xl self-start overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
                    <CardHeader className="flex flex-col items-center -mt-12 pb-4">
                        <Avatar className="h-24 w-24 border-4 border-slate-900 shadow-lg">
                            <AvatarImage src={user.foto_url || undefined} />
                            <AvatarFallback className="bg-slate-800 text-2xl text-slate-400 uppercase">
                                {user.nome_completo?.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center mt-2">
                            <CardTitle className="text-xl font-bold text-white">{user.nome_completo}</CardTitle>
                            <div className="flex justify-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase text-[10px] px-2">
                                    {user.tipo_conta}
                                </Badge>
                                {user.role === 'admin' && (
                                    <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px] px-2 h-5">
                                        ADMIN
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-4 border-t border-slate-800/50 bg-slate-900/50">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400 text-sm group">
                                <Mail className="h-4 w-4 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <MapPin className="h-4 w-4 text-blue-500/50" />
                                <span>{user.cidade}, {user.provincia}</span>
                            </div>
                            {user.bairro && (
                                <div className="flex items-center gap-3 text-slate-400 text-sm pl-7">
                                    <span className="text-xs opacity-70">Bairro: {user.bairro}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Calendar className="h-4 w-4 text-blue-500/50" />
                                <span>Desde {format(new Date(user.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 uppercase">Status da Conta</span>
                                <Badge
                                    variant={user.status === 'ativo' ? 'default' : 'destructive'}
                                    className={user.status === 'ativo' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/20' : ''}
                                >
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Tabs */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="requests" className="w-full">
                        <TabsList className="bg-slate-900 border-slate-800 p-1 w-full justify-start overflow-x-auto h-auto">
                            <TabsTrigger value="requests" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white flex-1 md:flex-none py-2.5">
                                <FileText className="h-4 w-4 mr-2" />
                                Pedidos ({requests?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="services" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white flex-1 md:flex-none py-2.5">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Serviços ({services?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="products" className="data-[state=active]:bg-slate-800 text-slate-400 data-[state=active]:text-white flex-1 md:flex-none py-2.5">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Marketplace ({products?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="requests" className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {requests && requests.length > 0 ? (
                                requests.map((item) => (
                                    <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-blue-500/30 transition-all group">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{item.titulo}</h4>
                                                <div className="flex gap-3 text-[10px] text-slate-500 mt-1.5 items-center">
                                                    <span>{format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span>{item.categoria}</span>
                                                </div>
                                            </div>
                                            <Badge className={item.urgente ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}>
                                                {item.urgente ? 'Urgente' : 'Normal'}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16 text-slate-500 bg-slate-900/40 rounded-xl border-2 border-dashed border-slate-800">
                                    <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                    <p>Nenhum pedido criado por este usuário.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="services" className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {services && services.length > 0 ? (
                                services.map((item) => (
                                    <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-purple-500/30 transition-all group">
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{item.titulo}</h4>
                                                <div className="flex gap-3 text-[10px] text-slate-500 mt-1.5 items-center">
                                                    <span>{format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span>{item.categoria}</span>
                                                </div>
                                            </div>
                                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 uppercase text-[10px]">
                                                {item.tipo}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16 text-slate-500 bg-slate-900/40 rounded-xl border-2 border-dashed border-slate-800">
                                    <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                    <p>Nenhum serviço oferecido por este usuário.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="products" className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {products && products.length > 0 ? (
                                    products.map((item) => (
                                        <Card key={item.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-orange-500/30 transition-all">
                                            <div className="aspect-video w-full bg-slate-800 overflow-hidden relative">
                                                {item.foto_url ? (
                                                    <img src={item.foto_url} alt={item.titulo} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-600">No Image</div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-slate-950/90 px-2 py-1 rounded text-xs font-bold text-orange-400 border border-orange-500/20 backdrop-blur-sm">
                                                    MZN {item.preco.toLocaleString()}
                                                </div>
                                            </div>
                                            <CardContent className="p-3">
                                                <h4 className="font-medium text-white truncate group-hover:text-orange-400 transition-colors">{item.titulo}</h4>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-[10px] text-slate-500">
                                                        {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                                    </p>
                                                    <Badge variant="outline" className="text-[9px] h-4 border-slate-700 text-slate-400">{item.status}</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-16 text-slate-500 bg-slate-900/40 rounded-xl border-2 border-dashed border-slate-800">
                                        <ShoppingBag className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                        <p>Nenhum produto anunciado por este usuário.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
