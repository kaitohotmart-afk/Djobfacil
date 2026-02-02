'use server'

import { createClient } from '@/lib/supabase/server'
import { createProductSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    // Extract data from FormData
    const titulo = formData.get('titulo') as string
    const descricao = formData.get('descricao') as string
    const preco = parseFloat(formData.get('preco') as string)
    const categoria = formData.get('categoria') as string
    const provincia = formData.get('provincia') as string
    const cidade = formData.get('cidade') as string
    const foto = formData.get('foto') as File | null

    // Validate with Zod
    const data = { titulo, descricao, preco, categoria, provincia, cidade }
    const result = createProductSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Dados inválidos. Verifique o formulário.' }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Você precisa estar logado para publicar um produto.' }
    }

    let foto_url = ''

    // Handle Image Upload if exists
    if (foto && foto.size > 0) {
        // Validate file type and size (max 2MB)
        if (foto.size > 2 * 1024 * 1024) {
            return { error: 'A imagem deve ter no máximo 2MB.' }
        }

        const fileName = `${user.id}-${Date.now()}-${foto.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, foto)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: 'Erro ao fazer upload da imagem.' }
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName)

        foto_url = publicUrl
    }

    // Insert Product
    const { error } = await supabase
        .from('products')
        .insert({
            user_id: user.id,
            titulo: result.data.titulo,
            descricao: result.data.descricao,
            preco: result.data.preco,
            categoria: result.data.categoria,
            provincia: result.data.provincia,
            cidade: result.data.cidade,
            foto_url: foto_url || null,
            status: 'ativo'
        })

    if (error) {
        console.error('Error creating product:', error)
        return { error: 'Erro ao publicar produto. Tente novamente.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/marketplace')
    redirect('/marketplace')
}
