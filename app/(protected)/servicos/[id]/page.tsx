import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, MapPin, Calendar, CheckCircle2, User, Laptop } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { StartServiceButton } from '../_components/start-service-button'
import { Badge } from '@/components/ui/badge'

export default async function ServiceDetailsPage(props: {
    params: Promise<{
        id: string
    }>
}) {
    const params = await props.params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: service } = await supabase
        .from('services')
        .select(`
      *,
      author:user_id (
        id,
        nome_completo,
        foto_url,
        bio,
        cidade,
        provincia
      )
    `)
        .eq('id', params.id)
        .single()

    if (!service) {
        notFound()
    }

    const isOwner = user.id === service.user_id
    const isDigital = service.tipo === 'digital'

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0B1120] text-slate-100 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-6">

                {/* Header Breadcrumb */}
                <div>
                    <Link href="/servicos" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors mb-4">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Voltar para Serviços
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            {service.titulo}
                        </h1>

                        <div className="flex flex-wrap gap-3">
                            <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10 px-3 py-1">
                                {service.categoria}
                            </Badge>
                            <Badge variant="outline" className={isDigital ? "border-purple-500/30 text-purple-300 bg-purple-500/10" : "border-slate-500/30 text-slate-300 bg-slate-500/10"}>
                                {isDigital ? <><Laptop className="w-3 h-3 mr-1" /> Digital (Remoto)</> : <><MapPin className="w-3 h-3 mr-1" /> Presencial (Local)</>}
                            </Badge>
                            <span className="text-sm text-slate-400 flex items-center bg-slate-800/50 px-3 py-1 rounded-full">
                                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                Publicado {formatDistanceToNow(new Date(service.created_at), { addSuffix: true, locale: ptBR })}
                            </span>
                        </div>

                        <Card className="bg-[#1E293B]/70 border-slate-700/50 backdrop-blur-md shadow-xl overflow-hidden">
                            <CardHeader className="bg-slate-800/30 border-b border-slate-700/50 pb-4">
                                <CardTitle className="text-lg text-slate-200">Sobre o Serviço</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {service.descricao}
                                </div>

                                {!isDigital && (
                                    <div className="flex items-center gap-2 p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
                                        <MapPin className="h-5 w-5 text-blue-400" />
                                        <div>
                                            <p className="text-sm text-slate-400">Localização do Serviço</p>
                                            <p className="font-medium text-white">{service.cidade}, {service.provincia}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="space-y-6">
                        <Card className="bg-[#1E293B] border-slate-700 shadow-xl sticky top-24">
                            <CardContent className="p-6 space-y-6">

                                {/* Provider Profile Summary */}
                                <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-700/50">
                                    <div className="h-20 w-20 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600 mb-2">
                                        {service.author?.foto_url ? (
                                            <img src={service.author.foto_url} alt={service.author.nome_completo} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-slate-400 m-auto mt-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Anunciado por</p>
                                        <h3 className="text-xl font-bold text-white mt-1">{service.author?.nome_completo}</h3>
                                        <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1">
                                            <MapPin className="h-3 w-3" /> {service.author?.cidade}, {service.author?.provincia}
                                        </p>
                                    </div>
                                    {service.author?.bio && (
                                        <p className="text-sm text-slate-400 italic">"{service.author.bio}"</p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <div className="space-y-3">
                                    {isOwner ? (
                                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-center text-sm">
                                            Este é seu próprio anúncio.
                                            <Button variant="link" className="text-yellow-400 underline mt-1" asChild>
                                                <Link href="/dashboard">Gerenciar no Dashboard</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <StartServiceButton serviceId={service.id} disabled={false} />
                                    )}

                                    {!isOwner && (
                                        <p className="text-xs text-center text-slate-500">
                                            A plataforma garante a segurança da negociação inicial.
                                            {isDigital && " Acompanhamento ativo da administração."}
                                        </p>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
                            <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Garantia DJOB
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li>• Perfis verificados</li>
                                <li>• Chat seguro e monitorado</li>
                                <li>• Suporte dedicado</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
