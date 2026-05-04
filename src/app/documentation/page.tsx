import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Code, Palette, Cpu, Bot, PencilRuler, Briefcase, KeyRound } from 'lucide-react';

const documentationSections = [
  {
    icon: Palette,
    title: "Design System",
    items: [
      {
        subtitle: "Paleta de Cores",
        description: "As cores seguem um sistema de theming com variáveis HSL, permitindo fácil customização para os modos claro (light) e escuro (dark).",
        details: [
          { label: "Background", value: "hsl(165 13% 95%)", colorClass: "bg-background" },
          { label: "Primary", value: "hsl(181 49% 43%)", colorClass: "bg-primary" },
          { label: "Accent", value: "hsl(182 28% 41%)", colorClass: "bg-accent" },
          { label: "Foreground", value: "hsl(240 10% 3.9%)", colorClass: "bg-foreground" },
        ]
      },
      {
        subtitle: "Tipografia",
        description: "As fontes foram escolhidas para garantir legibilidade, personalidade e uma boa hierarquia visual.",
        details: [
          { label: "Corpo e Títulos (PT Sans)", value: "Usada para a maioria dos textos, garantindo clareza.", class: "font-body" },
          { label: "Código (Source Code Pro)", value: "Aplicada em elementos que remetem a código, como no logo.", class: "font-code" },
          { label: "Escrita à Mão (Kalam)", value: "Usada para dar um toque pessoal e humano, como na seção 'Sobre'.", class: "font-handwriting" },
        ]
      },
      {
        subtitle: "Estilos e Efeitos",
        description: "A interface é construída com uma base moderna e consistente.",
        details: [
          { label: "Framework CSS", value: "Tailwind CSS para estilização utilitária." },
          { label: "Componentes UI", value: "ShadCN/UI para componentes reativos e acessíveis." },
          { label: "Ícones", value: "Lucide React para ícones limpos e consistentes." },
          { label: "Efeito Glow", value: "A classe 'glow-hover' aplica uma sombra e borda sutil em elementos interativos, como cards." },
        ]
      }
    ]
  },
  {
    icon: Cpu,
    title: "Funcionalidades Principais",
    items: [
      {
        icon: Briefcase,
        subtitle: "Formulário de Briefing (/briefing)",
        description: "O ponto de partida para qualquer projeto. Clientes preenchem um formulário detalhado que serve como base para a geração de orçamentos e protótipos. Os dados são salvos no Firestore e enviados via WhatsApp."
      },
      {
        icon: KeyRound,
        subtitle: "Autenticação e Intranet (/login e /intranet)",
        description: "Uma área restrita protegida por email e senha. A intranet é o painel de controle onde todas as solicitações de serviço são listadas e gerenciadas."
      },
      {
        icon: Bot,
        subtitle: "Geração de Orçamento com IA",
        description: "Na intranet, cada solicitação pode ter um orçamento gerado por IA (usando Genkit e Gemini). O fluxo analisa o briefing, segue regras de precificação e cria uma proposta de valor, prazo e escopo, que pode ser editada pelo administrador."
      },
      {
        icon: PencilRuler,
        subtitle: "Aceite de Proposta Online (/proposta/[id])",
        description: "Após gerar um orçamento, o sistema cria um link público e único para a proposta. O cliente pode visualizar, aprovar ou rejeitar a proposta online. A decisão é refletida em tempo real no painel da intranet."
      },
      {
        icon: Code,
        subtitle: "Laboratório de Prototipagem com IA (/lab/[id])",
        description: "Funcionalidade que utiliza um fluxo de IA para interpretar o briefing do cliente e gerar uma estrutura de layout visual para um site. É uma ferramenta poderosa para criar um piloto rápido e demonstrar o potencial do projeto ao cliente."
      },
    ]
  }
];

function ColorSwatch({ colorClass }: { colorClass: string }) {
  return <div className={`w-6 h-6 rounded-full border ${colorClass}`}></div>;
}

export default function DocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-6">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary">Documentação do Projeto</h1>
            <p className="text-lg text-muted-foreground mt-2">Um guia de referência sobre o design, componentes e funcionalidades do sistema.</p>
          </header>

          <div className="space-y-12">
            {documentationSections.map((section, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <section.icon className="w-8 h-8 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pl-12">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                        {item.icon && <item.icon className="w-5 h-5 text-accent" />}
                        {item.subtitle}
                      </h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      {item.details && (
                        <ul className="space-y-3">
                          {item.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-4 text-sm">
                              {detail.colorClass && <ColorSwatch colorClass={detail.colorClass} />}
                              <span className={`font-semibold ${detail.class || ''}`}>{detail.label}:</span>
                              <span className="text-muted-foreground">{detail.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
