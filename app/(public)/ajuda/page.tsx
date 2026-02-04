import { LegalContent } from '@/components/legal-content'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function HelpPage() {
    return (
        <LegalContent title="Central de Ajuda" updatedAt="04 de Fevereiro de 2026">
            <p>
                Bem-vindo à Central de Ajuda da DJOB FACIL. Aqui você encontrará respostas para as dúvidas mais comuns sobre o funcionamento da nossa plataforma.
            </p>

            <div className="not-prose mt-8">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            O que é o DJOB FACIL?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            A DJOB FACIL é uma plataforma moçambicana que conecta prestadores de serviços, clientes e vendedores em um único lugar. Nossa missão é facilitar o acesso a serviços profissionais e o comércio local em todo o país.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            Como faço para me cadastrar?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            Clique no botão "Criar Conta" no topo da página. Você precisará fornecer seu nome, e-mail, escolher sua província e definir se deseja ser um prestador de serviços, um cliente (quem contrata) ou ambos.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            A plataforma é segura?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            Sim. Implementamos avisos de segurança em todos os chats e monitoramos serviços digitais. Recomendamos sempre utilizar o nosso chat oficial para todas as negociações, pois ele serve como registro oficial em caso de problemas.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            Como funcionam os pagamentos?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Serviços Locais e Produtos:</strong> O pagamento é feito diretamente entre as partes. A plataforma não intermedia esses valores.</li>
                                <li><strong>Serviços Digitais:</strong> São intermediados pela plataforma para garantir que o prestador receba e o cliente tenha o trabalho entregue. Existe uma taxa de serviço de 10%.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            O que são Serviços Digitais?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            São serviços que podem ser realizados e entregues totalmente pela internet, como design gráfico, programação, consultoria online ou traduções. Estes serviços contam com proteção extra do administrador da plataforma.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:text-blue-400 font-bold py-6">
                            Como entro em contacto com o suporte?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-300 leading-relaxed pb-6">
                            Se você tiver qualquer problema ou dúvida que não esteja aqui, pode entrar em contacto directamente com o administrador através das nossas redes sociais ou pelo e-mail de suporte (em breve disponível no painel).
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <hr className="my-10 border-white/10" />

            <h3>Ainda tem dúvidas?</h3>
            <p>
                Se você não encontrou o que procurava, sinta-se à vontade para explorar nossas outras páginas legais ou entrar em contacto conosco.
            </p>
        </LegalContent>
    )
}
