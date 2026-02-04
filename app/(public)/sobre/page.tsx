import { LegalContent } from '@/components/legal-content'

export default function SobreNosPage() {
    return (
        <LegalContent title="Quem Somos">
            <p>
                Somos uma plataforma tecnológica criada para facilitar a ligação entre pessoas que precisam de serviços,
                pessoas que oferecem serviços e pessoas que desejam divulgar produtos físicos ou negócios em Moçambique.
            </p>
            <p>
                Nosso objetivo é organizar a comunicação e oferecer um ambiente seguro. No caso de serviços digitais,
                atuamos como intermediador técnico para reduzir conflitos e garantir transparência.
            </p>

            <h3>O QUE FAZEMOS</h3>
            <ul>
                <li>✅ Facilitamos a comunicação entre clientes e prestadores</li>
                <li>✅ Oferecemos chat interno com regras claras</li>
                <li>✅ Intermediamos serviços digitais para maior segurança</li>
                <li>✅ Reduzimos riscos através de registros e mediação</li>
                <li>✅ Disponibilizamos um espaço para marketplace de produtos físicos</li>
            </ul>

            <h3>O QUE NÃO FAZEMOS</h3>
            <ul>
                <li>❌ Não somos banco ou instituição financeira</li>
                <li>❌ Não fazemos investimentos nem prometemos ganhos</li>
                <li>❌ Não participamos de negociações fora da plataforma</li>
            </ul>

            <h3>SOBRE DINHEIRO E PAGAMENTOS</h3>
            <p>
                Em serviços digitais, o pagamento está sempre ligado a um serviço específico e ocorre apenas após acordo.
                A plataforma cobra uma taxa de serviço pelo uso da tecnologia e suporte.
            </p>

            <h3>NOSSO COMPROMISSO</h3>
            <p>
                Queremos criar um ambiente simples, transparente e adaptado à realidade local moçambicana.
                Sua segurança e satisfação são o centro do nosso desenvolvimento.
            </p>
        </LegalContent>
    )
}
