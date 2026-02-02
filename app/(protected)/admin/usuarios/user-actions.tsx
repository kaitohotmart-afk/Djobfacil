'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ShieldOff, ShieldCheck, Ban, Eye } from 'lucide-react'
import { updateUserStatus } from '../actions'
import Link from 'next/link'

export function UserActions({ userId, currentStatus }: { userId: string, currentStatus: string }) {
    const handleStatusChange = async (status: 'ativo' | 'suspenso' | 'bloqueado') => {
        try {
            const result = await updateUserStatus(userId, status)
            if (result.error) {
                alert(result.error)
            }
        } catch (error) {
            console.error('Failed to update status', error)
            alert('Erro ao atualizar status')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                <Link href={`/admin/usuarios/${userId}`}>
                    <DropdownMenuItem className="text-blue-400 focus:text-blue-300 focus:bg-blue-500/10 cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil Completo
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="bg-white/5" />

                {currentStatus !== 'ativo' && (
                    <DropdownMenuItem
                        onClick={() => handleStatusChange('ativo')}
                        className="text-green-400 focus:text-green-300 focus:bg-green-500/10 cursor-pointer"
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Ativar Conta
                    </DropdownMenuItem>
                )}

                {currentStatus !== 'suspenso' && (
                    <DropdownMenuItem
                        onClick={() => handleStatusChange('suspenso')}
                        className="text-yellow-400 focus:text-yellow-300 focus:bg-yellow-500/10 cursor-pointer"
                    >
                        <ShieldOff className="mr-2 h-4 w-4" />
                        Suspender Temporariamente
                    </DropdownMenuItem>
                )}

                {currentStatus !== 'bloqueado' && (
                    <DropdownMenuItem
                        onClick={() => handleStatusChange('bloqueado')}
                        className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        Bloquear Permanentemente
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
