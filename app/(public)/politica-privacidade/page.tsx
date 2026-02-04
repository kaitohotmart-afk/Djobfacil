import { LegalContent } from '@/components/legal-content'

export default function PoliticaPrivacidadePage() {
    return (
        <LegalContent title="Política de Privacidade" updatedAt="04 de Fevereiro de 2026">
            <p>
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais quando você utiliza nossa plataforma.
            </p>

            <h3>1. DADOS QUE COLETAMOS</h3>
            <p>Ao criar uma conta, coletamos:</p>
            <ul>
                <li>Nome completo</li>
                <li>Email</li>
                <li>Senha (armazenada de forma criptografada)</li>
                <li>Província, Cidade e Bairro</li>
                <li>Tipo de conta (prestador/cliente/ambos)</li>
                <li>Foto de perfil (opcional)</li>
            </ul>

            <p>Durante o uso, também coletamos:</p>
            <ul>
                <li>Mensagens enviadas no chat</li>
                <li>Conteúdo publicado (serviços, pedidos, produtos)</li>
                <li>Logs de ações, data e hora de acesso</li>
            </ul>

            <h3>2. COMO USAMOS SEUS DADOS</h3>
            <p>Seus dados são usados para permitir o funcionamento da plataforma, facilitar a comunicação, intermediar serviços, resolver disputas e melhorar a segurança.</p>
            <p><strong>Nós NÃO vendemos seus dados pessoais a terceiros.</strong></p>

            <h3>3. COMPARTILHAMENTO DE DADOS</h3>
            <p>Seus dados são compartilhados apenas com outros usuários logados (perfil público), com o administrador (para mediação de chat) ou com autoridades quando exigido por lei.</p>

            <h3>4. ARMAZENAMENTO E SEGURANÇA</h3>
            <p>Seus dados são armazenados em servidores seguros (Supabase). Utilizamos criptografia de senhas, conexão HTTPS e políticas de segurança no banco de dados (RLS).</p>
            <p><strong>Apesar de todas as medidas, nenhum sistema é 100% seguro. Use senhas fortes.</strong></p>

            <h3>5. SEUS DIREITOS</h3>
            <p>Você tem direito a acessar, corrigir ou solicitar a exclusão de seus dados. Para isso, contacte o suporte oficial.</p>

            <h3>6. RETENÇÃO DE DADOS</h3>
            <p>Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão, dados pessoais são removidos, mas mensagens podem ser mantidas anonimizadas para auditoria.</p>

            <h3>7. COOKIES</h3>
            <p>Usamos cookies para manter sua sessão ativa e melhorar a experiência do usuário.</p>

            <h3>8. MENORES DE IDADE</h3>
            <p>A plataforma não é destinada a menores de 18 anos.</p>

            <h3>9. ALTERAÇÕES NESTA POLÍTICA</h3>
            <p>Podemos atualizar esta Política a qualquer momento. O uso contínuo significa aceitação da nova versão.</p>
        </LegalContent>
    )
}
