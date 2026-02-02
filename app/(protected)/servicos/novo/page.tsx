'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createServiceSchema, CreateServiceFormData } from '@/lib/validations'
import { createService } from '../actions'
import { PROVINCIAS, CATEGORIAS_SERVICOS } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { Loader2, ArrowLeft, Laptop, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewServicePage() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<CreateServiceFormData>({
        resolver: zodResolver(createServiceSchema),
        defaultValues: {
            titulo: '',
            descricao: '',
            cidade: '',
            tipo: 'local',
        },
    })

    // Error handler
    const onInvalid = (errors: any) => {
        console.error('Form validation errors:', errors)
        toast.error('Por favor, verifique os campos em vermelho.')
    }

    async function onSubmit(data: CreateServiceFormData) {
        setIsLoading(true)
        console.log('Submitting Service:', data)

        try {
            const result = await createService(data)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Serviço anunciado com sucesso!')
                // Redirect handled by server action
            }
        } catch (error) {
            console.error('Submit Error:', error)
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                throw error
            }
            toast.error('Ocorreu um erro ao criar o serviço.')
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
                        <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors mb-2">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Anunciar Novo Serviço</h1>
                        <p className="text-slate-400">
                            Divulgue suas habilidades e encontre novos clientes.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="bg-[#1E293B]/70 border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-800/30 border-b border-slate-700/50 pb-6">
                        <CardTitle className="text-xl text-white">Detalhes do Serviço</CardTitle>
                        <CardDescription className="text-slate-400">
                            Descreva o que você oferece com clareza.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                                {/* Título */}
                                <FormField
                                    control={form.control}
                                    name="titulo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">Título do Serviço</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Consultoria Jurídica, Manutenção de Ar Condicionado..."
                                                    {...field}
                                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Tipo de Serviço (Radio Cards) */}
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-slate-200 text-base font-medium">Tipo de Serviço</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    {/* Local option */}
                                                    <div>
                                                        <RadioGroupItem value="local" id="local" className="peer sr-only" />
                                                        <FormLabel
                                                            htmlFor="local"
                                                            className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer transition-all h-full"
                                                        >
                                                            <MapPin className="mb-3 h-8 w-8 text-blue-400" />
                                                            <div className="text-center">
                                                                <span className="block font-bold text-white text-lg">Presencial (Local)</span>
                                                                <span className="block text-sm text-slate-400 mt-1">Requer presença física no local do cliente ou escritório.</span>
                                                            </div>
                                                        </FormLabel>
                                                    </div>

                                                    {/* Digital option */}
                                                    <div>
                                                        <RadioGroupItem value="digital" id="digital" className="peer sr-only" />
                                                        <FormLabel
                                                            htmlFor="digital"
                                                            className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer transition-all h-full"
                                                        >
                                                            <Laptop className="mb-3 h-8 w-8 text-purple-400" />
                                                            <div className="text-center">
                                                                <span className="block font-bold text-white text-lg">Digital (Remoto)</span>
                                                                <span className="block text-sm text-slate-400 mt-1">Realizado online (Zoom, entregas digitais, etc).</span>
                                                            </div>
                                                        </FormLabel>
                                                    </div>
                                                </RadioGroup>
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

                                {/* Cidade */}
                                <FormField
                                    control={form.control}
                                    name="cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">Cidade / Bairro</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Beira, Macurungo"
                                                    {...field}
                                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Descrição */}
                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">Descrição Detalhada</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detalhe o que inclui seu serviço, sua experiência, e o que o cliente pode esperar."
                                                    className="min-h-[150px] bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y text-base p-4 leading-relaxed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
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
                                        <Link href="/dashboard">Cancelar</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-base font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 transition-all w-full sm:w-auto"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Criando Anúncio...
                                            </>
                                        ) : (
                                            'Publicar Serviço'
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
