'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { createReview } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReviewModalProps {
    avaliadoId: string
    avaliadoNome: string
}

export function ReviewModal({ avaliadoId, avaliadoNome }: ReviewModalProps) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (rating === 0) {
            toast.error('Por favor, selecione uma nota.')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('avaliado_id', avaliadoId)
        formData.append('nota', rating.toString())
        formData.append('comentario', comment)

        const result = await createReview(formData)

        setLoading(false)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Avaliação enviada com sucesso!')
            setOpen(false)
            setRating(0)
            setComment('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                    <Star className="mr-2 h-4 w-4" />
                    Avaliar
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Avaliar {avaliadoNome}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Compartilhe sua experiência com este prestador.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <Label>Sua Nota</Label>
                        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoverRating || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment">Comentário (Opcional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Conte como foi o serviço..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-400">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-500">
                        {loading ? 'Enviando...' : 'Enviar Avaliação'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
