'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { PROVINCIAS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Package, Loader2, Sparkles, UserPlus } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            tipo_conta: 'ambos',
            termos_aceitos: false,
        },
    })

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const { signUp } = await import('./actions')
            const result = await signUp(data)

            if (result?.error) {
                setError(result.error)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            console.error('Error signing up:', err)
            setError('Ocorreu um erro ao criar sua conta. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const tipoConta = watch('tipo_conta')
    const termosAceitos = watch('termos_aceitos')

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
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            DJOB FACIL
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Já tem uma conta?</span>
                        <Link href="/login">
                            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                Entrar
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <UserPlus className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-300">Cadastro Gratuito</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Criar Conta
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Cadastre-se gratuitamente e comece a usar a plataforma
                        </p>
                    </div>

                    <Card className="bg-slate-900/80 border-white/10 p-8 backdrop-blur-xl shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Dados Pessoais */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 pb-2">
                                    <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                                    <h2 className="text-xl font-semibold text-white">Dados Pessoais</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="nome_completo" className="text-gray-300">
                                            Nome Completo <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="nome_completo"
                                            {...register('nome_completo')}
                                            placeholder="Seu nome completo"
                                            className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.nome_completo ? 'border-red-500/50' : ''}`}
                                        />
                                        {errors.nome_completo && (
                                            <p className="text-sm text-red-400 mt-2">{errors.nome_completo.message}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email" className="text-gray-300">
                                                Email <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register('email')}
                                                placeholder="seu@email.com"
                                                className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.email ? 'border-red-500/50' : ''}`}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-400 mt-2">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="text-gray-300">
                                                Senha <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                {...register('password')}
                                                placeholder="Mínimo 6 caracteres"
                                                className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.password ? 'border-red-500/50' : ''}`}
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-400 mt-2">{errors.password.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword" className="text-gray-300">
                                            Confirmar Senha <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            {...register('confirmPassword')}
                                            placeholder="Digite a senha novamente"
                                            className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-400 mt-2">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                    <h2 className="text-xl font-semibold text-white">Tipo de Conta</h2>
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

                            {/* Termos */}
                            <div className={`flex items-start space-x-3 p-4 rounded-lg bg-slate-800/30 border transition-all ${errors.termos_aceitos ? 'border-red-500/50' : 'border-white/5'}`}>
                                <Checkbox
                                    id="termos"
                                    checked={termosAceitos || false}
                                    onCheckedChange={(checked) => setValue('termos_aceitos', checked as boolean)}
                                    className={`mt-1 ${errors.termos_aceitos ? 'border-red-500' : 'border-white/20'}`}
                                />
                                <Label htmlFor="termos" className="font-normal text-sm cursor-pointer text-gray-300 leading-relaxed">
                                    Aceito os termos de uso e política de privacidade da plataforma{' '}
                                    <span className="text-red-400">*</span>
                                </Label>
                            </div>
                            {errors.termos_aceitos && (
                                <p className="text-sm text-red-400">{errors.termos_aceitos.message}</p>
                            )}
                            {!termosAceitos && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                    <p className="text-sm text-amber-400 flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Você deve aceitar os termos de uso para criar uma conta
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                size="lg"
                                disabled={isLoading || !termosAceitos}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Criar Conta
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Ao criar uma conta, você concorda com nossos termos de serviço e política de privacidade.
                    </p>
                </div>
            </main>
        </div>
    )
}
