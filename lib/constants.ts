export const PROVINCIAS = [
    'Niassa',
    'Cabo Delgado',
    'Nampula',
    'Zambézia',
    'Tete',
    'Manica',
    'Sofala',
    'Inhambane',
    'Gaza',
    'Maputo (Província)',
    'Maputo (Cidade)',
] as const

export type Provincia = typeof PROVINCIAS[number]

export const CATEGORIAS_SERVICOS = [
    'Construção e Reparos',
    'Limpeza e Conservação',
    'Tecnologia e Informática',
    'Design e Criatividade',
    'Educação e Formação',
    'Saúde e Bem-estar',
    'Eventos e Entretenimento',
    'Transporte e Logística',
    'Beleza e Estética',
    'Consultoria e Negócios',
    'Outros',
] as const

export type CategoriaServico = typeof CATEGORIAS_SERVICOS[number]

export const CATEGORIAS_PRODUTOS = [
    'Eletrónicos',
    'Veículos',
    'Imóveis',
    'Moda e Vestuário',
    'Casa e Decoração',
    'Beleza e Cosméticos',
    'Desporto e Lazer',
    'Livros e Educação',
    'Telefones e Acessórios',
    'Outros',
] as const

export type CategoriaProduto = typeof CATEGORIAS_PRODUTOS[number]

export const AVISOS_CHAT = {
    servico_local: `🔔 Aviso de Segurança

Este é um serviço local (presencial).
A plataforma não intermedia pagamentos.
Combine detalhes diretamente com o prestador.`,

    servico_digital: `🔔 Aviso de Segurança - Serviço Digital

Este serviço é intermediado pela plataforma.

✓ Pagamento deve ser feito à plataforma (taxa: 10%)
✓ O administrador acompanha esta conversa
✓ Não compartilhe dados de pagamento pessoais
✓ Negociações fora da plataforma não são protegidas

Para sua segurança, siga as regras da plataforma.`,

    produto: `🔔 Aviso de Segurança - Produto Físico

A plataforma não intermedia pagamentos de produtos físicos.

✓ Negocie com cuidado
✓ Encontre-se em locais públicos
✓ Verifique o produto antes de pagar
✓ Desconfie de preços muito baixos

Qualquer problema, denuncie através do suporte.`,

    pedido: `🔔 Aviso de Segurança

Este é um serviço local (presencial).
A plataforma não intermedia pagamentos.
Combine detalhes diretamente com o prestador.`,
} as const

export type TipoConversa = keyof typeof AVISOS_CHAT
