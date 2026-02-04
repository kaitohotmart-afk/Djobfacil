/**
 * Detecta informações sensíveis em texto para evitar contorno da plataforma.
 * Filtra números de telefone moçambicanos, URLs e palavras-chave de pagamento externo.
 */
export function containsSensitiveInfo(text: string): boolean {
    if (!text) return false;

    const lowercaseText = text.toLowerCase();

    // 1. Números de Telefone Moçambicanos (ex: 82, 84, 85, 86, 87)
    // Detecta formatos comuns: 841234567, +258 84 123 4567, 84-123-4567
    const phoneRegex = /(?:\+?258)?\s?(?:8[2-7])\s?\d{3}\s?\d{4}|(?:\+?258)?\s?(?:8[2-7])\d{7}/g;

    // 2. URLs (simples)
    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;

    // 3. Palavras-chave de pagamento/contato externo
    const forbiddenKeywords = [
        'mpesa', 'm-pesa', 'm pesa',
        'emola', 'e-mola', 'e mola',
        'whatsapp', 'zap', 'watsap',
        'chama no', 'meu numero', 'meu número',
        'pagar fora', 'transferencia', 'transferência'
    ];

    if (phoneRegex.test(text)) return true;
    if (urlRegex.test(text)) return true;

    return forbiddenKeywords.some(keyword => lowercaseText.includes(keyword));
}
