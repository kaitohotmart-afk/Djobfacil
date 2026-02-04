'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { uploadPortfolioItem, deletePortfolioItem } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PortfolioItem {
    id: string
    titulo: string
    descricao: string
    image_url: string
}

interface PortfolioPageProps {
    items: PortfolioItem[]
}

// Client component wrapper that receives initial data or fetches it?
// Usually better to pass data from Server Component page.tsx. 
// Use this as the form/list component.

export function PortfolioManager({ initialItems }: { initialItems: PortfolioItem[] }) {
    const [items, setItems] = useState<PortfolioItem[]>(initialItems)
    const [isUploading, setIsUploading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter()

    async function handleUpload(formData: FormData) {
        setIsUploading(true)
        const result = await uploadPortfolioItem(formData)
        setIsUploading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Item adicionado ao portfólio!')
            formRef.current?.reset()
            router.refresh() // Refresh server data
        }
    }

    async function handleDelete(id: string, url: string) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return

        const result = await deletePortfolioItem(id, url)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Item removido!')
            // Optimistic update
            setItems((prev) => prev.filter(item => item.id !== id))
            router.refresh()
        }
    }

    return (
        <div className="space-y-8">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Adicionar Novo Trabalho</CardTitle>
                    <CardDescription className="text-slate-400">
                        Mostre o seu melhor! Adicione fotos de serviços realizados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={handleUpload} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="titulo" className="text-white">Título do Trabalho</Label>
                            <Input id="titulo" name="titulo" placeholder="Ex: Reforma de Apartamento" className="bg-slate-800 border-slate-700 text-white" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descricao" className="text-white">Descrição (Opcional)</Label>
                            <Textarea id="descricao" name="descricao" placeholder="Detalhes sobre o que foi feito..." className="bg-slate-800 border-slate-700 text-white" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="file" className="text-white">Foto do Resultado</Label>
                            <div className="flex items-center gap-4">
                                <Input id="file" name="file" type="file" accept="image/*" className="bg-slate-800 border-slate-700 text-white cursor-pointer file:text-blue-400 file:bg-slate-900 file:border-0 file:mr-4 file:font-semibold" required />
                            </div>
                        </div>

                        <Button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar ao Portfólio
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="bg-slate-900 border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="aspect-video relative overflow-hidden bg-slate-950">
                            <img
                                src={item.image_url}
                                alt={item.titulo}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                onClick={() => handleDelete(item.id, item.image_url)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white truncate text-lg mb-1">{item.titulo}</h3>
                            {item.descricao && (
                                <p className="text-sm text-slate-400 line-clamp-2">{item.descricao}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                        <ImageIcon className="h-8 w-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Seu portfólio está vazio</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Adicione fotos dos seus melhores trabalhos para atrair mais clientes.</p>
                </div>
            )}
        </div>
    )
}
