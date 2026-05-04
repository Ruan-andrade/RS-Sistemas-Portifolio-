'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schemas para os props de cada componente
const HeaderPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'Header'."),
    props: z.object({
        title: z.string().describe('O nome da empresa ou do site a ser exibido no cabeçalho.'),
        navLinks: z.array(z.string()).describe('Uma lista de 3 a 5 links de navegação principais.'),
    })
});

const HeroPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'Hero'."),
    props: z.object({
        title: z.string().describe('Um título de impacto para a seção principal.'),
        subtitle: z.string().describe('Um subtítulo que complementa o título e descreve o negócio.'),
        cta: z.string().describe('Texto para o botão de chamada para ação (Call to Action).'),
    })
});

const AboutPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'About'."),
    props: z.object({
        title: z.string().describe('Título para a seção "Sobre", ex: "Sobre Nós".'),
        text: z.string().describe('Um parágrafo descrevendo a empresa ou o profissional.'),
    })
});

const ServicesPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'Services'."),
    props: z.object({
        title: z.string().describe('Título para a seção de serviços, ex: "Nossos Serviços".'),
        services: z.array(z.object({
            title: z.string().describe('Nome do serviço.'),
            description: z.string().describe('Breve descrição do serviço.')
        })).describe('Uma lista de 3 a 4 serviços principais.')
    })
});

const ContactPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'Contact'."),
    props: z.object({
        title: z.string().describe('Título para a seção de contato, ex: "Entre em Contato".'),
        text: z.string().describe('Um texto convidativo para o contato.'),
        cta: z.string().describe('Texto para o botão de contato.'),
    })
});

const FooterPropsSchema = z.object({
    component: z.string().describe("O nome do componente, deve ser 'Footer'."),
    props: z.object({
        companyName: z.string().describe('O nome da empresa para o aviso de direitos autorais.')
    })
});

// Union de todos os componentes possíveis
const LayoutElementSchema = z.union([
    HeaderPropsSchema,
    HeroPropsSchema,
    AboutPropsSchema,
    ServicesPropsSchema,
    ContactPropsSchema,
    FooterPropsSchema
]);

export type LayoutElement = z.infer<typeof LayoutElementSchema>;

const BriefingInputSchema = z.string().describe('Uma string JSON contendo todos os detalhes do briefing preenchido pelo cliente.');

const LayoutOutputSchema = z.array(LayoutElementSchema).describe('Um array de objetos, cada um representando um componente do layout da página, em ordem.');


export async function generateLayout(input: string): Promise<LayoutElement[]> {
  return generateLayoutFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateLayoutPrompt',
  input: { schema: BriefingInputSchema },
  output: { schema: LayoutOutputSchema },
  prompt: `Você é um web designer de IA. Sua tarefa é criar uma estrutura de layout de site (em JSON) com base em um briefing de cliente. O layout deve ser uma lista de componentes em ordem lógica.

  **Briefing do Cliente (JSON):**
  {{{input}}}
  
  **Diretrizes:**
  1.  **Analise o Briefing:** Preste atenção ao 'objective', 'siteSize', e 'features' para decidir quais componentes incluir.
  2.  **Estrutura Obrigatória:** SEMPRE inclua 'Header', 'Hero', 'Contact' e 'Footer'. O campo 'component' de cada objeto deve ter o nome exato do componente.
  3.  **Componentes Condicionais:**
      *   Inclua 'About' se o site não for uma 'Landing Page'.
      *   Inclua 'Services' se o 'objective' for 'Gerar Leads/Orçamentos' ou 'Loja Virtual/E-commerce', ou se 'siteSize' não for 'One Page'.
  4.  **Conteúdo Criativo:** Crie textos (títulos, subtítulos, parágrafos) que sejam relevantes para o negócio do cliente, com base no 'objective'. Seja criativo e profissional.
  5.  **Adapte ao Estilo:** Use a 'vibe' do briefing para influenciar o tom dos textos. Por exemplo, um tom 'Descontraído/Amigável' deve ter textos mais casuais.
  6.  **Saída:** Retorne um array de objetos JSON, onde cada objeto corresponde a um componente do layout na ordem em que deve aparecer na página. Use o 'component' como discriminador.`,
});

const generateLayoutFlow = ai.defineFlow(
  {
    name: 'generateLayoutFlow',
    inputSchema: BriefingInputSchema,
    outputSchema: LayoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar o layout.');
    }
    return output;
  }
);
