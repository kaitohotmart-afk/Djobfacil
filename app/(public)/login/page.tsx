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

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900/80 text-gray-400">Ou continue com</span>
                                </div>
                            </div>

                            {/* Google OAuth Button */}
                            <Button
                                type="button"
                                onClick={async () => {
                                    setIsLoading(true)
                                    try {
                                        console.log('Iniciando login do Google...')
                                        const supabase = createClient()
                                        const { error } = await supabase.auth.signInWithOAuth({
                                            provider: 'google',
                                            options: {
                                                redirectTo: `${window.location.origin}/auth/callback`,
                                            },
                                        })

                                        if (error) {
                                            throw error
                                        }
                                        // Loading state remains true while redirecting
                                    } catch (err: any) {
                                        console.error('Erro ao iniciar OAuth:', err)
                                        setError(`Erro ao conectar com Google: ${err.message}`)
                                        setIsLoading(false)
                                    }
                                }}
                                variant="outline"
                                className="w-full bg-white hover:bg-gray-100 text-gray-900 py-6 text-base border-2 border-gray-200 hover:border-gray-300 transition-all"
                                size="lg"
                                disabled={isLoading}
                            >
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Entrar com Google
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
