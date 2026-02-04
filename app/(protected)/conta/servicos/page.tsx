import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, Plus, Laptop, MapPin } from 'lucide-react'

export default async function MyServicesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <Card className="bg-slate-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl text-white">Meus Serviços</CardTitle>
                    <CardDescription className="text-gray-400">
                        Serviços que você oferece na plataforma.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/servicos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Publicar Serviço
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {services && services.length > 0 ? (
                        services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-white">{service.titulo}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                                            {service.categoria}
                                        </Badge>
                                        <span className="flex items-center gap-1">
                                            {service.tipo === 'digital' ? <Laptop className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                            {service.tipo}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={service.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                                        {service.status}
                                    </Badge>
                                    <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <Link href={`/servicos/${service.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Nenhum serviço publicado.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
