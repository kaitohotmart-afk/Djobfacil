import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, Plus } from 'lucide-react'

export default async function MyRequestsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <Card className="bg-slate-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl text-white">Meus Pedidos</CardTitle>
                    <CardDescription className="text-gray-400">
                        Histórico de serviços que você solicitou.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/pedidos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Pedido
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {requests && requests.length > 0 ? (
                        requests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-white">{req.titulo}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                                            {req.categoria}
                                        </Badge>
                                        <span>• {format(new Date(req.created_at), 'dd MMM yyyy', { locale: ptBR })}</span>
                                        {req.urgente && (
                                            <Badge variant="destructive" className="text-[10px]">Urgente</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={req.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                                        {req.status}
                                    </Badge>
                                    <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <Link href={`/pedidos/${req.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Nenhum pedido encontrado.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
