'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createRequestSchema, CreateRequestFormData } from '@/lib/validations'
import { createRequest } from '../actions'
import { PROVINCIAS, CATEGORIAS_SERVICOS } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewRequestPage() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<CreateRequestFormData>({
        resolver: zodResolver(createRequestSchema),
        defaultValues: {
            titulo: '',
            descricao: '',
            categoria: '',
            tipo: 'presencial' as const,
            provincia: 'Maputo (Cidade)' as const,
            cidade: '',
            bairro: '',
            data_desejada: '',
            horario: '',
            prazo_entrega: '',
            referencia_link: '',
            urgente: false,
        },
    })

    const onInvalid = (errors: any) => {
        console.error('Form validation errors:', errors)
        toast.error('Por favor, verifique os campos em vermelho.')
    }

    const tipo = form.watch('tipo')

    async function onSubmit(data: CreateRequestFormData) {
        setIsLoading(true)
        console.log('Submitting data:', data)

        try {
            const result = await createRequest(data)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Pedido criado com sucesso!')
            }
        } catch (error) {
            console.error('Submit Error:', error)
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                throw error
            }
            toast.error('Ocorreu um erro ao criar o pedido.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <Link href="/pedidos" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors mb-2">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Voltar ao mural
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Preciso de um Profissional</h1>
                        <p className="text-slate-400">
                            Publique o que você precisa e receba propostas de profissionais.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="bg-[#1E293B]/70 border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-800/30 border-b border-slate-700/50 pb-6">
                        <CardTitle className="text-xl text-white">Detalhes da Solicitação</CardTitle>
                        <CardDescription className="text-slate-400">
                            Seja específico para atrair os melhores profissionais.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                                {/* Tipo de Serviço */}
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-slate-200 text-base font-medium">Tipo de Serviço</FormLabel>
                                            <FormControl>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('presencial')}
                                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${field.value === 'presencial'
                                                            ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20'
                                                            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <span className="text-2xl mb-2">🏠</span>
                                                        <span className="font-semibold">Serviço Presencial</span>
                                                        <span className="text-[10px] opacity-60 mt-1">O profissional vem até você</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('digital')}
                                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${field.value === 'digital'
                                                            ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/20'
                                                            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <span className="text-2xl mb-2">💻</span>
                                                        <span className="font-semibold">Serviço Digital</span>
                                                        <span className="text-[10px] opacity-60 mt-1">Feito remotamente/online</span>
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Título */}
                                <FormField
                                    control={form.control}
                                    name="titulo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">O que você precisa?</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Preciso de um eletricista para trocar fiação"
                                                    {...field}
                                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Categoria e Provincia (Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="categoria"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 text-base font-medium">Categoria</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white h-12">
                                                            <SelectValue placeholder="Selecione a categoria" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                        {CATEGORIAS_SERVICOS.map((categoria) => (
                                                            <SelectItem key={categoria} value={categoria} className="focus:bg-slate-700 focus:text-white cursor-pointer py-3">
                                                                {categoria}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="provincia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 text-base font-medium">Província</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white h-12">
                                                            <SelectValue placeholder="Selecione a província" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
                                                        {PROVINCIAS.map((provincia) => (
                                                            <SelectItem key={provincia} value={provincia} className="focus:bg-slate-700 focus:text-white cursor-pointer py-3">
                                                                {provincia}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="cidade"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 text-base font-medium">Cidade</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Maputo"
                                                        {...field}
                                                        className="bg-slate-900/50 border-slate-700 text-white h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />

                                    {tipo === 'presencial' && (
                                        <FormField
                                            control={form.control}
                                            name="bairro"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-200 text-base font-medium">Bairro (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: Polana Cimento"
                                                            {...field}
                                                            className="bg-slate-900/50 border-slate-700 text-white h-12 transition-all text-base"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-400" />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                {tipo === 'presencial' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
                                        <FormField
                                            control={form.control}
                                            name="data_desejada"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-300 text-sm">📅 Data Desejada</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            className="bg-slate-900 border-slate-700 text-white h-10"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="horario"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-300 text-sm">🕒 Horário (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: Período da manhã"
                                                            {...field}
                                                            className="bg-slate-900 border-slate-700 text-white h-10"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {tipo === 'digital' && (
                                    <div className="space-y-6 bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
                                        <FormField
                                            control={form.control}
                                            name="prazo_entrega"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-300 text-sm">⏳ Prazo de Entrega</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: 5 dias úteis"
                                                            {...field}
                                                            className="bg-slate-900 border-slate-700 text-white h-10"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="referencia_link"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-300 text-sm">🔗 Link de Referência (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: pinterest.com/minha-ideia"
                                                            {...field}
                                                            className="bg-slate-900 border-slate-700 text-white h-10"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-slate-500 text-[10px]">
                                                        Ajude o profissional a entender seu estilo ou necessidade digital.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Descrição */}
                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">Descrição Detalhada</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva todos os detalhes importantes para que o profissional possa te enviar um orçamento preciso."
                                                    className="min-h-[150px] bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y text-base p-4 leading-relaxed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Urgente Box */}
                                <FormField
                                    control={form.control}
                                    name="urgente"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-4 rounded-xl border border-red-500/30 bg-red-500/5 p-6 transition-all hover:bg-red-500/10 hover:border-red-500/50">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-6 w-6 border-2 border-red-500/50 data-[state=checked]:bg-red-500 data-[state=checked]:text-white data-[state=checked]:border-red-500 rounded-md transition-all"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-red-300 font-bold text-lg cursor-pointer flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Tenho urgência
                                                </FormLabel>
                                                <FormDescription className="text-red-400/70 text-sm">
                                                    Seu pedido aparecerá com destaque para os profissionais.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Footer Buttons */}
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 mt-6 border-t border-slate-700/50">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        asChild
                                        className="h-12 px-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                        <Link href="/pedidos">Cancelar</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 transition-all w-full sm:w-auto"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Publicando...
                                            </>
                                        ) : (
                                            'Publicar Solicitação'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
