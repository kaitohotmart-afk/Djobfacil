import { createClient } from '@/lib/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ContentActions } from './content-actions-client'
import { FileText, Briefcase, ShoppingBag } from 'lucide-react'

export default async function AdminContentPage() {
    const supabase = await createClient()

    // Fetch all content types
    const { data: requests } = await supabase
        .from('requests')
        .select('*, author:user_id(nome_completo)')
        .order('created_at', { ascending: false })
        .limit(50)

    const { data: services } = await supabase
        .from('services')
        .select('*, author:user_id(nome_completo)')
        .order('created_at', { ascending: false })
        .limit(50)

    const { data: products } = await supabase
        .from('products')
        .select('*, author:user_id(nome_completo)')
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Gestão de Conteúdo</h2>
                <p className="text-gray-400">Gerencie todos os anúncios e solicitações da plataforma.</p>
            </div>

            <Tabs defaultValue="pedidos" className="w-full">
                <TabsList className="bg-slate-900 border border-white/10 p-1 h-12">
                    <TabsTrigger value="pedidos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2 px-6">
                        <FileText className="h-4 w-4" />
                        Pedidos
                    </TabsTrigger>
                    <TabsTrigger value="servicos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2 px-6">
                        <Briefcase className="h-4 w-4" />
                        Serviços
                    </TabsTrigger>
                    <TabsTrigger value="produtos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2 px-6">
                        <ShoppingBag className="h-4 w-4" />
                        Produtos
                    </TabsTrigger>
                </TabsList>

                {/* Pedidos */}
                <TabsContent value="pedidos" className="mt-6">
                    <ContentTable
                        data={requests || []}
                        type="requests"
                        columns={['Título', 'Autor', 'Categoria', 'Status', 'Data']}
                    />
                </TabsContent>

                {/* Serviços */}
                <TabsContent value="servicos" className="mt-6">
                    <ContentTable
                        data={services || []}
                        type="services"
                        columns={['Título', 'Prestador', 'Tipo', 'Status', 'Data']}
                    />
                </TabsContent>

                {/* Produtos */}
                <TabsContent value="produtos" className="mt-6">
                    <ContentTable
                        data={products || []}
                        type="products"
                        columns={['Título', 'Vendedor', 'Preço', 'Status', 'Data']}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function ContentTable({ data, type, columns }: { data: any[], type: 'requests' | 'services' | 'products', columns: string[] }) {
    return (
        <div className="rounded-md border border-white/10 bg-slate-900/50 backdrop-blur overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-900">
                    <TableRow className="border-white/10 hover:bg-slate-900">
                        {columns.map(col => (
                            <TableHead key={col} className="text-gray-400">{col}</TableHead>
                        ))}
                        <TableHead className="text-right text-gray-400">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="border-white/10 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-white max-w-[300px] truncate">
                                {item.titulo}
                            </TableCell>
                            <TableCell className="text-gray-300">
                                {item.author?.nome_completo || 'Usuário Removido'}
                            </TableCell>
                            <TableCell className="text-gray-400">
                                {type === 'requests' ? item.categoria :
                                    type === 'services' ? (
                                        <Badge variant="outline" className={item.tipo === 'digital' ? 'border-purple-500/30 text-purple-400' : 'border-blue-500/30 text-blue-400'}>
                                            {item.tipo}
                                        </Badge>
                                    ) : (
                                        <span className="text-blue-400 font-bold">MT {item.preco}</span>
                                    )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={item.status === 'ativo' ? 'default' : 'destructive'}
                                    className={item.status === 'ativo' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-500 text-sm">
                                {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right">
                                <ContentActions type={type} id={item.id} currentStatus={item.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="text-center py-10 text-gray-500">
                                Nenhum item encontrado nesta categoria.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
