'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PROVINCIAS } from '@/lib/constants'
import { updateProfile } from '../profile-actions'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Camera, User } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is installed, or use alert/custom toast

interface ProfileFormProps {
    user: {
        id: string
        nome_completo: string
        email: string
        bio: string | null
        provincia: string | null
        cidade: string | null
        foto_url: string | null
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.foto_url)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('A imagem deve ter no máximo 2MB.')
                return
            }
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const uploadAvatar = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error) {
            console.error('Error uploading avatar:', error)
            return null
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        // Upload avatar if selected
        if (avatarFile) {
            const publicUrl = await uploadAvatar(avatarFile)
            if (publicUrl) {
                formData.set('foto_url', publicUrl)
            } else {
                alert('Erro ao fazer upload da imagem. Tente novamente.')
                setIsLoading(false)
                return
            }
        }

        const result = await updateProfile(formData)

        setIsLoading(false)
        if (result.error) {
            alert(result.error)
        } else {
            alert('Perfil atualizado com sucesso!')
            // router.refresh() // handled by server action revalidatePath
        }
    }

    return (
        <Card className="bg-slate-900 border-white/10">
            <CardHeader>
                <CardTitle className="text-xl text-white">Seus Dados</CardTitle>
                <CardDescription className="text-gray-400">
                    Gerencie suas informações pessoais e como você aparece para outros usuários.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center sm:items-start gap-4">
                        <Label>Foto de Perfil</Label>
                        <div className="flex items-center gap-6">
                            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-500">
                                        <User className="h-10 w-10" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Alterar Foto
                                </Button>
                                <p className="text-xs text-gray-500">
                                    JPG, PNG ou GIF. Máximo 2MB.
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nome_completo">Nome Completo</Label>
                            <Input
                                id="nome_completo"
                                name="nome_completo"
                                defaultValue={user.nome_completo}
                                required
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="bg-slate-800/50 border-slate-700 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="provincia">Província</Label>
                                <Select name="provincia" defaultValue={user.provincia || undefined}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Selecione sua província" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                        {PROVINCIAS.map((prov) => (
                                            <SelectItem key={prov} value={prov}>
                                                {prov}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cidade">Cidade / Distrito</Label>
                            <Input
                                id="cidade"
                                name="cidade"
                                defaultValue={user.cidade || ''}
                                placeholder="Ex: Maputo, Matola, Beira..."
                                required
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio / Sobre Mim</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={user.bio || ''}
                                placeholder="Conte um pouco sobre você e seus serviços..."
                                maxLength={200}
                                className="bg-slate-800 border-slate-700 text-white resize-none h-24"
                            />
                            <p className="text-xs text-right text-gray-500">Máximo 200 caracteres</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
