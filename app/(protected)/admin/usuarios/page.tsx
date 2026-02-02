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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MoreHorizontal, Shield, User, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UserActions } from './user-actions'

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>
}) {
    const params = await searchParams
    const supabase = await createClient()
    const query = params.q || ''
    const page = Number(params.page) || 1
    const perPage = 20

    // Build query
    let supabaseQuery = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

    if (query) {
        supabaseQuery = supabaseQuery.or(`nome_completo.ilike.%${query}%,email.ilike.%${query}%,provincia.ilike.%${query}%`)
    }

    const { data: users, count } = await supabaseQuery

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Usuários</h2>
                    <p className="text-gray-400">Gerenciamento de contas ({count} total)</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex w-full max-w-sm items-center space-x-2">
                <form className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        name="q"
                        placeholder="Buscar por nome, email ou província..."
                        className="w-full bg-slate-900 border-white/10 pl-9 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        defaultValue={query}
                    />
                </form>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-slate-900/50 backdrop-blur">
                <Table>
                    <TableHeader className="bg-slate-900 hover:bg-slate-900">
                        <TableRow className="border-white/10 hover:bg-slate-900">
                            <TableHead className="text-gray-400">Usuário</TableHead>
                            <TableHead className="text-gray-400">Localização</TableHead>
                            <TableHead className="text-gray-400">Tipo</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Data Cadastro</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id} className="border-white/10 hover:bg-slate-800/50">
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        <AvatarImage src={user.foto_url || undefined} />
                                        <AvatarFallback className="bg-slate-800 text-gray-400 uppercase">
                                            {user.nome_completo?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-white flex items-center gap-2">
                                            {user.nome_completo}
                                            {user.role === 'admin' && (
                                                <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px] px-1 py-0 h-4">
                                                    ADMIN
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <MapPin className="mr-1 h-3 w-3" />
                                        {user.cidade}, {user.provincia}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-800 text-gray-300 hover:bg-slate-700 uppercase text-[10px]">
                                        {user.tipo_conta}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.status === 'ativo' ? 'default' : 'destructive'}
                                        className={user.status === 'ativo' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm">
                                    {format(new Date(user.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <UserActions userId={user.id} currentStatus={user.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
