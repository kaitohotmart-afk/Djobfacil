'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupFormData } from '@/lib/validations'
import { PROVINCIAS, CATEGORIAS_SERVICOS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Package, Loader2 } from 'lucide-react'

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
            const supabase = createClient()

            // 1. Criar usuário no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('Falha ao criar usuário')

            // 2. Inserir dados adicionais na tabela users
            const { error: dbError } = await supabase.from('users').insert({
                id: authData.user.id,
                email: data.email,
                // password_hash não é necessário aqui pois o Supabase Auth já gerencia
                password_hash: 'managed_by_supabase_auth',
                nome_completo: data.nome_completo,
                provincia: data.provincia,
                cidade: data.cidade,
                bairro: data.bairro || null,
                tipo_conta: data.tipo_conta,
                termos_aceitos: true,
            })

            if (dbError) throw dbError

            // 3. Redirecionar para dashboard
            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            console.error('Error signing up:', err)
            setError(err.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const tipoConta = watch('tipo_conta')
    const termosAceitos = watch('termos_aceitos')

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            {/* Header */}
            <header className="w-full border-b bg-white">
                <div className="container flex h-16 items-center justify-between mx-auto px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Package className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">DJOB FACIL</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Já tem uma conta?</span>
                        <Link href="/login">
                            <Button variant="ghost">Entrar</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Criar Conta</h1>
                        <p className="text-gray-600">
                            Cadastre-se gratuitamente e comece a usar a plataforma
                        </p>
                    </div>

                    <Card className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Dados Pessoais */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">📝 Dados Pessoais</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="nome_completo">
                                            Nome Completo <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="nome_completo"
                                            {...register('nome_completo')}
                                            placeholder="Seu nome completo"
                                            className={errors.nome_completo ? 'border-red-500' : ''}
                                        />
                                        {errors.nome_completo && (
                                            <p className="text-sm text-red-500 mt-1">{errors.nome_completo.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
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
                                        <Label htmlFor="password">
                                            Senha <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            {...register('password')}
                                            placeholder="Mínimo 6 caracteres"
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">
                                            Confirmar Senha <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            {...register('confirmPassword')}
                                            placeholder="Digite a senha novamente"
                                            className={errors.confirmPassword ? 'border-red-500' : ''}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Localização */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">📍 Localização</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="provincia">
                                            Província <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={watch('provincia')}
                                            onValueChange={(value) => setValue('provincia', value as any)}
                                        >
                                            <SelectTrigger className={errors.provincia ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Selecione sua província" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROVINCIAS.map((provincia) => (
                                                    <SelectItem key={provincia} value={provincia}>
                                                        {provincia}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.provincia && (
                                            <p className="text-sm text-red-500 mt-1">{errors.provincia.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="cidade">
                                            Cidade/Distrito <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="cidade"
                                            {...register('cidade')}
                                            placeholder="Sua cidade ou distrito"
                                            className={errors.cidade ? 'border-red-500' : ''}
                                        />
                                        {errors.cidade && (
                                            <p className="text-sm text-red-500 mt-1">{errors.cidade.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="bairro">Bairro (opcional)</Label>
                                        <Input
                                            id="bairro"
                                            {...register('bairro')}
                                            placeholder="Seu bairro"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tipo de Conta */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">👤 Tipo de Conta</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
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
                                        />
                                        <Label htmlFor="tipo_prestador" className="font-normal cursor-pointer">
                                            Quero oferecerserviços
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
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
                                        />
                                        <Label htmlFor="tipo_cliente" className="font-normal cursor-pointer">
                                            Quero encontrar serviços
                                        </Label>
                                    </div>
                                </div>
                                {errors.tipo_conta && (
                                    <p className="text-sm text-red-500 mt-2">{errors.tipo_conta.message}</p>
                                )}
                            </div>

                            {/* Termos */}
                            <div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="termos"
                                        checked={termosAceitos}
                                        onCheckedChange={(checked) => setValue('termos_aceitos', checked as boolean)}
                                    />
                                    <Label htmlFor="termos" className="font-normal text-sm cursor-pointer">
                                        Aceito os termos de uso e política de privacidade da plataforma{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                </div>
                                {errors.termos_aceitos && (
                                    <p className="text-sm text-red-500 mt-1">{errors.termos_aceitos.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    'Criar Conta'
                                )}
                            </Button>
                        </form>
                    </Card>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Ao crear uma conta, você concorda com nossos termos de serviço e política de privacidade.
                    </p>
                </div>
            </main>
        </div>
    )
}
