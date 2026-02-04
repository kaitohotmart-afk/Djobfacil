'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { PROVINCIAS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Package, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'

const completeProfileSchema = z.object({
    provincia: z.string().min(1, 'Selecione sua província'),
    cidade: z.string().min(2, 'Digite sua cidade'),
    bairro: z.string().optional(),
    tipo_conta: z.enum(['prestador', 'cliente', 'ambos'], {
        required_error: 'Selecione pelo menos uma opção',
    }),
})

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>

export default function CompletarPerfilPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CompleteProfileFormData>({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            tipo_conta: 'ambos',
        },
    })

    const onSubmit = async (data: CompleteProfileFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('Usuário não autenticado')
                return
            }

            // Update user profile
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    provincia: data.provincia,
                    cidade: data.cidade,
                    bairro: data.bairro || null,
                    tipo_conta: data.tipo_conta,
                    perfil_completo: true,
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            console.error('Error completing profile:', err)
            setError('Ocorreu um erro ao completar seu perfil. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const tipoConta = watch('tipo_conta')

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                <div className="container flex h-20 items-center justify-between mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-lg opacity-75"></div>
                            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            DJOB FACIL
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-300">Quase lá!</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Complete seu Perfil
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Precisamos de mais algumas informações para completar seu cadastro
                        </p>
                    </div>

                    <Card className="bg-slate-900/80 border-white/10 p-8 backdrop-blur-xl shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Localização */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2">
                                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></div>
                                    <h2 className="text-xl font-semibold text-white">Localização</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="provincia" className="text-gray-300">
                                            Província <span className="text-red-400">*</span>
                                        </Label>
                                        <Select
                                            value={watch('provincia') || ""}
                                            onValueChange={(value) => setValue('provincia', value as any)}
                                        >
                                            <SelectTrigger className={`mt-2 bg-slate-800/50 border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.provincia ? 'border-red-500/50' : ''}`}>
                                                <SelectValue placeholder="Selecione sua província" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-white/10">
                                                {PROVINCIAS.map((provincia) => (
                                                    <SelectItem key={provincia} value={provincia} className="text-white hover:bg-slate-700">
                                                        {provincia}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.provincia && (
                                            <p className="text-sm text-red-400 mt-2">{errors.provincia.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="cidade" className="text-gray-300">
                                            Cidade/Distrito <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="cidade"
                                            {...register('cidade')}
                                            placeholder="Sua cidade ou distrito"
                                            className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.cidade ? 'border-red-500/50' : ''}`}
                                        />
                                        {errors.cidade && (
                                            <p className="text-sm text-red-400 mt-2">{errors.cidade.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="bairro" className="text-gray-300">Bairro (opcional)</Label>
                                    <Input
                                        id="bairro"
                                        {...register('bairro')}
                                        placeholder="Seu bairro"
                                        className="mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            {/* Tipo de Conta */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2">
                                    <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    <h2 className="text-xl font-semibold text-white">Como você pretende usar a plataforma?</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 transition-all">
                                        <Checkbox
                                            id="tipo_prestador"
                                            checked={tipoConta === 'prestador' || tipoConta === 'ambos'}
                                            onCheckedChange={(checked) => {
                                                if (checked && tipoConta === 'cliente') {
                                                    setValue('tipo_conta', 'ambos')
                                                } else if (!checked && tipoConta === 'ambos') {
                                                    setValue('tipo_conta', 'cliente')
                                                } else if (checked && tipoConta !== 'prestador') {
                                                    setValue('tipo_conta', 'prestador')
                                                }
                                            }}
                                            className="border-white/20"
                                        />
                                        <Label htmlFor="tipo_prestador" className="font-normal cursor-pointer text-gray-300 flex-1">
                                            Quero oferecer serviços
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-cyan-500/30 transition-all">
                                        <Checkbox
                                            id="tipo_cliente"
                                            checked={tipoConta === 'cliente' || tipoConta === 'ambos'}
                                            onCheckedChange={(checked) => {
                                                if (checked && tipoConta === 'prestador') {
                                                    setValue('tipo_conta', 'ambos')
                                                } else if (!checked && tipoConta === 'ambos') {
                                                    setValue('tipo_conta', 'prestador')
                                                } else if (checked && tipoConta !== 'cliente') {
                                                    setValue('tipo_conta', 'cliente')
                                                }
                                            }}
                                            className="border-white/20"
                                        />
                                        <Label htmlFor="tipo_cliente" className="font-normal cursor-pointer text-gray-300 flex-1">
                                            Quero encontrar serviços
                                        </Label>
                                    </div>
                                </div>
                                {errors.tipo_conta && (
                                    <p className="text-sm text-red-400 mt-2">{errors.tipo_conta.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Completar Cadastro
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    )
}
