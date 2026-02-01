import { z } from 'zod'
import { PROVINCIAS } from './constants'

// Schema para criação de conta
export const signupSchema = z.object({
    nome_completo: z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(255, 'Nome muito longo'),
    email: z
        .string()
        .email('Email inválido')
        .toLowerCase(),
    password: z
        .string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha muito longa'),
    confirmPassword: z.string(),
    provincia: z.enum(PROVINCIAS, {
        errorMap: () => ({ message: 'Selecione uma província' }),
    }),
    cidade: z
        .string()
        .min(2, 'Cidade deve ter pelo menos 2 caracteres')
        .max(100, 'Cidade muito longa'),
    bairro: z
        .string()
        .max(100, 'Bairro muito longo')
        .optional()
        .or(z.literal('')),
    tipo_conta: z.enum(['prestador', 'cliente', 'ambos'], {
        errorMap: () => ({ message: 'Selecione o tipo de conta' }),
    }),
    termos_aceitos: z.literal(true, {
        errorMap: () => ({ message: 'Você deve aceitar os termos de uso' }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

export type SignupFormData = z.infer<typeof signupSchema>

// Schema para login
export const loginSchema = z.object({
    email: z.string().email('Email inválido').toLowerCase(),
    password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema para recuperar senha
export const recoverPasswordSchema = z.object({
    email: z.string().email('Email inválido').toLowerCase(),
})

export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>

// Schema para criar pedido
export const createRequestSchema = z.object({
    titulo: z
        .string()
        .min(5, 'Título deve ter pelo menos 5 caracteres')
        .max(255, 'Título muito longo'),
    descricao: z
        .string()
        .min(20, 'Descrição deve ter pelo menos 20 caracteres')
        .max(2000, 'Descrição muito longa'),
    categoria: z.string().min(1, 'Selecione uma categoria'),
    provincia: z.enum(PROVINCIAS),
    cidade: z
        .string()
        .min(2, 'Cidade deve ter pelo menos 2 caracteres')
        .max(100, 'Cidade muito longa'),
    urgente: z.boolean().default(false),
})

export type CreateRequestFormData = z.infer<typeof createRequestSchema>

// Schema para criar serviço
export const createServiceSchema = z.object({
    titulo: z
        .string()
        .min(5, 'Título deve ter pelo menos 5 caracteres')
        .max(255, 'Título muito longo'),
    descricao: z
        .string()
        .min(20, 'Descrição deve ter pelo menos 20 caracteres')
        .max(2000, 'Descrição muito longa'),
    categoria: z.string().min(1, 'Selecione uma categoria'),
    provincia: z.enum(PROVINCIAS),
    cidade: z
        .string()
        .min(2, 'Cidade deve ter pelo menos 2 caracteres')
        .max(100, 'Cidade muito longa'),
    tipo: z.enum(['local', 'digital'], {
        errorMap: () => ({ message: 'Selecione o tipo de serviço' }),
    }),
})

export type CreateServiceFormData = z.infer<typeof createServiceSchema>

// Schema para criar produto
export const createProductSchema = z.object({
    titulo: z
        .string()
        .min(5, 'Título deve ter pelo menos 5 caracteres')
        .max(255, 'Título muito longo'),
    descricao: z
        .string()
        .min(20, 'Descrição deve ter pelo menos 20 caracteres')
        .max(2000, 'Descrição muito longa'),
    preco: z
        .number()
        .positive('Preço deve ser maior que zero')
        .max(999999999.99, 'Preço muito alto'),
    categoria: z.string().min(1, 'Selecione uma categoria'),
    provincia: z.enum(PROVINCIAS),
    cidade: z
        .string()
        .min(2, 'Cidade deve ter pelo menos 2 caracteres')
        .max(100, 'Cidade muito longa'),
    foto_url: z.string().url().optional().or(z.literal('')),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
