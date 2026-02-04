'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { updatePassword } from '../security-actions'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'

export function SecurityForm() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await updatePassword(formData)

        setIsLoading(false)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.success)
            e.currentTarget.reset()
        }
    }

    return (
        <Card className="bg-slate-900 border-white/10">
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-400" />
                    Segurança
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Gerencie sua senha e acesso à conta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            required
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Atualizar Senha
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
