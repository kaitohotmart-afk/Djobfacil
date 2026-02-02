'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

interface RegistrationChartProps {
    data: { date: string; count: number }[]
}

export function RegistrationChart({ data }: RegistrationChartProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-4 shadow-xl">
            <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    Tendência de Cadastros (Últimos 30 dias)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                }}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#1e293b',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#3b82f6' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                labelFormatter={(label) => {
                                    const date = new Date(label);
                                    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                                name="Novos Usuários"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
