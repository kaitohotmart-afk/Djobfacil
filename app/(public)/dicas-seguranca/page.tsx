import { LegalContent } from '@/components/legal-content'

export default function DicasSegurancaPage() {
    return (
        <LegalContent title="Dicas de Segurança">
            <p>
                Estas orientações existem porque a segurança depende também do comportamento do usuário.
                Muitos problemas podem ser evitados seguindo regras básicas.
            </p>

            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-xl my-8">
                <h3 className="text-blue-400 mt-0! flex items-center gap-2">
                    <span>👉</span> Regra de Ouro da Plataforma
                </h3>
                <p className="mb-0 font-bold text-white">
                    Tudo deve acontecer dentro da plataforma: Conversas, Acordos e Pagamentos (digitais).
                    Se algo acontecer fora, você não está protegido.
                </p>
            </div>

            <h3>SERVIÇOS DIGITAIS</h3>
            <p><strong>✅ Nunca pague fora da plataforma:</strong> Use apenas métodos oficiais. Pagamentos diretos ao prestador ou por canais externos não são reembolsáveis nem protegidos.</p>
            <p><strong>⚠️ Desconfie de pressa:</strong> Burladores criam urgência falsa para você agir sem pensar. Se alguém te pressionar, pare e avise o administrador.</p>

            <h3>USO DO CHAT</h3>
            <p>O chat é o registo oficial. Escreva tudo claramente (prazos, valores, detalhes). Lembre-se que mensagens são permanentes: não podem ser apagadas ou editadas.</p>

            <h3>MARKETPLACE (PRODUTOS FÍSICOS)</h3>
            <ul>
                <li>Encontre-se em locais públicos e movimentados</li>
                <li>Evite pagamentos antecipados sem ver o produto</li>
                <li>Verifique o produto pessoalmente antes de concluir</li>
                <li>Desconfie de preços excessivamente baixos</li>
            </ul>

            <h3>SINAIS DE BURLA ⚠️</h3>
            <p>Desconfie imediatamente se alguém:</p>
            <ul>
                <li>Pede para sair da plataforma ("Vamos pro WhatsApp")</li>
                <li>Oferece desconto exagerado para pagar fora do site</li>
                <li>Promete resultados garantidos ou ganhos irreais</li>
                <li>Usa histórias emocionais para pedir urgência</li>
            </ul>

            <h3>COMO DENUNCIAR</h3>
            <p>Notou algo suspeito? Use o botão de denúncia ou contacte o suporte oficial. Denúncias ajudam a proteger toda a comunidade moçambicana.</p>

            <p className="italic text-slate-400 mt-12">
                A plataforma fornece ferramentas de segurança, mas o bom senso e a atenção do usuário são fundamentais.
            </p>
        </LegalContent>
    )
}
