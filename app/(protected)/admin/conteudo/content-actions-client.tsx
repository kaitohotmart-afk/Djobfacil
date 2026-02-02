'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Power, Trash2, CheckCircle, PackageCheck } from 'lucide-react'
import { updateContentStatus } from '../content-actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ContentActionsProps {
    type: 'requests' | 'services' | 'products'
    id: string
    currentStatus: string
}

export function ContentActions({ type, id, currentStatus }: ContentActionsProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = async (newStatus: 'ativo' | 'inativo' | 'vendido' | 'fechado' | 'removido') => {
        setIsLoading(true)
        try {
            const result = await updateContentStatus(type, id, newStatus)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Status atualizado com sucesso!')
            }
        } catch (error) {
            toast.error('Erro ao processar ação.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white" disabled={isLoading}>
                    <span className="sr-only">Abrir menu</span>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-gray-300">
                <DropdownMenuLabel>Ações de Moderação</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />

                {currentStatus !== 'ativo' && (
                    <DropdownMenuItem onClick={() => handleAction('ativo')} className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Ativar Conteúdo
                    </DropdownMenuItem>
                )}

                {currentStatus === 'ativo' && (
                    <DropdownMenuItem onClick={() => handleAction('inativo')} className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2">
                        <Power className="h-4 w-4 text-amber-500" /> Desativar Temporariamente
                    </DropdownMenuItem>
                )}

                {type === 'products' && currentStatus !== 'vendido' && (
                    <DropdownMenuItem onClick={() => handleAction('vendido')} className="focus:bg-slate-800 focus:text-white cursor-pointer gap-2">
                        <PackageCheck className="h-4 w-4 text-blue-500" /> Marcar como Vendido
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-white/5" />

                <DropdownMenuItem
                    onClick={() => handleAction('removido')}
                    className="focus:bg-red-900/30 focus:text-red-400 text-red-400 cursor-pointer gap-2"
                >
                    <Trash2 className="h-4 w-4" /> Remover Permanentemente
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
