'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Loader2 } from 'lucide-react'
import { createProposal } from '@/app/(protected)/proposals/actions'
import { toast } from 'sonner'

interface ProposalModalProps {
    conversationId: string
    receiverId: string
}

export function ProposalModal({ conversationId, receiverId }: ProposalModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const result = await createProposal({
            conversation_id: conversationId,
            receiver_id: receiverId,
            description,
            price: Number(price)
        })

        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Proposta enviada com sucesso!')
            setOpen(false)
            setDescription('')
            setPrice('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <FileText className="h-4 w-4 text-purple-400" />
                    Enviar Proposta
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Enviar Proposta de Serviço</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Formalize o que será feito e o valor. O cliente poderá aceitar ou recusar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">O que será feito?</Label>
                        <Textarea
                            id="description"
                            required
                            className="bg-slate-950 border-slate-800 min-h-[100px]"
                            placeholder="Descreva os detalhes do serviço..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Valor (MZN)</Label>
                        <Input
                            id="price"
                            type="number"
                            required
                            min="1"
                            className="bg-slate-950 border-slate-800"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Proposta
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
