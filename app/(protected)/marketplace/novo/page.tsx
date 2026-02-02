'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema, CreateProductFormData } from '@/lib/validations'
import { createProduct } from '../actions'
import { PROVINCIAS, CATEGORIAS_PRODUTOS } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Loader2, ArrowLeft, ImagePlus, X, UploadCloud, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NewProductPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateProductFormData>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            titulo: '',
            descricao: '',
            cidade: '',
            preco: 0,
            foto_url: '',
        },
    })

    const onInvalid = (errors: any) => {
        console.error('Validation errors:', errors)
        toast.error('Por favor, preencha todos os campos corretamente.')
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('A imagem deve ter no máximo 2MB.')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function onSubmit(data: CreateProductFormData) {
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('titulo', data.titulo)
            formData.append('descricao', data.descricao)
            formData.append('preco', data.preco.toString())
            formData.append('categoria', data.categoria)
            formData.append('provincia', data.provincia)
            formData.append('cidade', data.cidade)

            const file = fileInputRef.current?.files?.[0]
            if (file) {
                formData.append('foto', file)
            }

            const result = await createProduct(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Produto publicado com sucesso!')
            }
        } catch (error) {
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                throw error
            }
            console.error('Submit Error:', error)
            toast.error('Ocorreu um erro ao publicar o produto.')
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
                        <h1 className="text-3xl font-bold tracking-tight text-white">Publicar Produto</h1>
                        <p className="text-slate-400">
                            Transforme itens que você não usa mais em dinheiro.
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>No MVP, permitimos <b>uma foto</b> por produto. Escolha a melhor imagem para atrair compradores!</p>
                </div>

                {/* Main Card */}
                <Card className="bg-[#1E293B]/70 border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-800/30 border-b border-slate-700/50 pb-6">
                        <CardTitle className="text-xl text-white">Detalhes do Produto</CardTitle>
                        <CardDescription className="text-slate-400">
                            Preencha as informações básicas para o seu anúncio.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                                {/* Upload Section */}
                                <div className="space-y-4">
                                    <FormLabel className="text-slate-200 text-base font-medium">Foto do Produto</FormLabel>
                                    <div className="flex flex-col items-center justify-center">
                                        {!imagePreview ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-64 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/30 hover:bg-slate-800/40 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                                            >
                                                <div className="p-4 bg-slate-800 rounded-full">
                                                    <UploadCloud className="h-8 w-8 text-blue-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium text-slate-200">Clique para selecionar uma foto</p>
                                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG ou WEBP (Max 2MB)</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-80 rounded-2xl overflow-hidden group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-black/40" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                        Trocar Imagem
                                                    </Button>
                                                    <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                                                        <X className="h-4 w-4 mr-1" /> Remover
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                {/* Título */}
                                <FormField
                                    control={form.control}
                                    name="titulo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">O que você está vendendo?</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: iPhone 13 Pro Max 256GB, Sofá de Couro..."
                                                    {...field}
                                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Price and Category (Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="preco"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 text-base font-medium">Preço (MT)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-3 text-slate-500 font-bold">MT</span>
                                                        <Input
                                                            type="number"
                                                            placeholder="0,00"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            className="bg-slate-900/50 border-slate-700 text-white pl-12 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />

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
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
                                                        {CATEGORIAS_PRODUTOS.map((categoria) => (
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
                                </div>

                                {/* Location (Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                    <FormField
                                        control={form.control}
                                        name="cidade"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 text-base font-medium">Cidade / Bairro</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Maputo, Bairro Central"
                                                        {...field}
                                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Descrição */}
                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 text-base font-medium">Descrição Completa</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva o estado do produto, tempo de uso, motivo da venda e o que mais considerar importante."
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
                                                Publicando...
                                            </>
                                        ) : (
                                            'Publicar Anúncio'
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
