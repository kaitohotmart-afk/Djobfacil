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
import { Package, Loader2 } from 'lucide-react'

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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <header className="w-full border-b bg-white">
                <div className="container flex h-16 items-center justify-between mx-auto px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Package className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">DJOB FACIL</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Não tem uma conta?</span>
                        <Link href="/signup">
                            <Button variant="ghost">Criar Conta</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
                        <p className="text-gray-600">
                            Entre na sua conta para acessar a plataforma
                        </p>
                    </div>

                    <Card className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="seu@email.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Link
                                        href="/recuperar-senha"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    placeholder="Sua senha"
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </Button>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Não tem uma conta?{' '}
                        <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                            Criar conta grátis
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
