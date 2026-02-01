'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { recoverPasswordSchema, type RecoverPasswordFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Package, Loader2, CheckCircle } from 'lucide-react'

export default function RecoverPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RecoverPasswordFormData>({
        resolver: zodResolver(recoverPasswordSchema),
    })

    const onSubmit = async (data: RecoverPasswordFormData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const supabase = createClient()

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/auth/callback`,
            })

            if (resetError) throw resetError

            setSuccess(true)
        } catch (err: any) {
            console.error('Error recovering password:', err)
            setError('Ocorreu um erro ao enviar o email. Tente novamente.')
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
                    <Link href="/login">
                        <Button variant="ghost">Voltar ao Login</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Recuperar Senha</h1>
                        <p className="text-gray-600">
                            Digite seu email para receber instruções de recuperação
                        </p>
                    </div>

                    <Card className="p-8">
                        {success ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email enviado!</h3>
                                    <p className="text-sm text-gray-600">
                                        Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                                    </p>
                                </div>
                                <Link href="/login">
                                    <Button className="w-full">Voltar ao Login</Button>
                                </Link>
                            </div>
                        ) : (
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

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Email de Recuperação'
                                    )}
                                </Button>
                            </form>
                        )}
                    </Card>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Lembrou da senha?{' '}
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
