import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Briefcase, ShoppingBag, UserPlus, TrendingUp } from 'lucide-react'
import { RegistrationChart } from './_components/registration-chart'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch basic stats
    const { count: usersCount } = await supabase.from('users').select('id', { count: 'exact', head: true })
    const { count: requestsCount } = await supabase.from('requests').select('id', { count: 'exact', head: true })
    const { count: servicesCount } = await supabase.from('services').select('id', { count: 'exact', head: true })
    const { count: productsCount } = await supabase.from('products').select('id', { count: 'exact', head: true })

    // Extended stats
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { count: newUsersToday } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gt('created_at', last24h)

    const { count: newUsersWeek } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gt('created_at', last7d)

    // Fetch data for chart (last 30 days)
    const { data: recentUsers } = await supabase
        .from('users')
        .select('created_at')
        .gt('created_at', last30d)

    const last30DaysLabels = Array.from({ length: 30 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse()

    const chartData = last30DaysLabels.map(date => ({
        date,
        count: recentUsers?.filter(u => u.created_at.startsWith(date)).length || 0
    }))

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Admin</h2>
                <p className="text-slate-400">Monitoramento e gestão da plataforma DJOB FACIL.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-blue-500/5 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Novos Usuários (24h)
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">+{newUsersToday || 0}</div>
                        <p className="text-xs text-slate-500">
                            Cadastrados hoje
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-cyan-500/5 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Novos Usuários (7d)
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">+{newUsersWeek || 0}</div>
                        <p className="text-xs text-slate-500">
                            Última semana
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-indigo-500/5 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            Total Usuários
                        </CardTitle>
                        <Users className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{usersCount || 0}</div>
                        <p className="text-xs text-slate-500">
                            Base total de contas
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Pedidos
                        </CardTitle>
                        <FileText className="h-3.5 w-3.5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white">{requestsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Serviços
                        </CardTitle>
                        <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white">{servicesCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Marketplace
                        </CardTitle>
                        <ShoppingBag className="h-3.5 w-3.5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-white">{productsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Atividade
                        </CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-green-500">Sistema Online</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <RegistrationChart data={chartData} />
            </div>
        </div>
    )
}
