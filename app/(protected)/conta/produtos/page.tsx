import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, Plus } from 'lucide-react'

export default async function MyProductsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <Card className="bg-slate-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl text-white">Meus Produtos</CardTitle>
                    <CardDescription className="text-gray-400">
                        Produtos que você está vendendo.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                    <Link href="/marketplace/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Vender Produto
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products && products.length > 0 ? (
                        products.map((prod) => (
                            <div key={prod.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-white">{prod.titulo}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="font-bold text-green-400">
                                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(prod.preco)}
                                        </span>
                                        <span>• {prod.categoria}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={prod.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                                        {prod.status}
                                    </Badge>
                                    <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                        <Link href={`/marketplace/${prod.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
