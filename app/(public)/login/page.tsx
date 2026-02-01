'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Package, Loader2, LogIn, Sparkles } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (signInError) throw signInError

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            console.error('Error logging in:', err)
            setError('Email ou senha incorretos. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

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
                        <span className="text-sm text-gray-400">Não tem uma conta?</span>
                        <Link href="/signup">
                            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                Criar Conta
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <LogIn className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-300">Acesso Seguro</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Bem-vindo de volta
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Entre na sua conta para acessar a plataforma
                        </p>
                    </div>

                    <Card className="bg-slate-900/80 border-white/10 p-8 backdrop-blur-xl shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-gray-300">Email</Label>
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
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="password" className="text-gray-300">Senha</Label>
                                    <Link
                                        href="/recuperar-senha"
                                        className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    placeholder="Sua senha"
                                    className={`mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 ${errors.password ? 'border-red-500/50' : ''}`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-400 mt-2">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Entrar
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Não tem uma conta?{' '}
                        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium">
                            Criar conta grátis
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
