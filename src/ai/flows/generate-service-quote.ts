'use server';
/**
 * @fileOverview Flow de IA para gerar um orçamento de serviço a partir de um briefing detalhado.
 *
 * - generateServiceQuote - A função que gera a proposta.
 * - ServiceQuoteInput - O tipo de entrada para a função (os detalhes do briefing).
 * - ServiceQuoteOutput - O tipo de saída (a proposta gerada).
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ServiceQuoteInputSchema = z.string().describe('Uma string JSON contendo todos os detalhes do briefing preenchido pelo cliente.');

const ServiceQuoteOutputSchema = z.object({
  priceRange: z.string().describe('Uma faixa de preço estimada para o projeto. Ex: "R$ 3.500,00 - R$ 5.000,00".'),
  timeline: z.string().describe('O prazo estimado para a conclusão do projeto. Ex: "3 - 5 semanas".'),
  scope: z.array(z.string()).describe('Uma lista de itens detalhando o que está incluído no escopo do projeto.'),
  observations: z.string().describe('Observações adicionais, como o que pode influenciar o preço final ou próximos passos.'),
});

export type ServiceQuoteInput = z.infer<typeof ServiceQuoteInputSchema>;
export type ServiceQuoteOutput = z.infer<typeof ServiceQuoteOutputSchema>;


export async function generateServiceQuote(
  input: ServiceQuoteInput
): Promise<ServiceQuoteOutput> {
  return generateServiceQuoteFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateServiceQuotePrompt',
  input: { schema: ServiceQuoteInputSchema },
  output: { schema: ServiceQuoteOutputSchema },
  prompt: `Você é um especialista em desenvolvimento de software e deve criar uma proposta de orçamento (quote) com base no briefing de um cliente, fornecido em formato JSON.

Siga estas regras de forma ESTRITA para calcular o orçamento. Você deve agir como uma calculadora, sem adicionar aleatoriedade.

JSON do Briefing:
{{{input}}}

**REGRAS DE CÁLCULO:**

1.  **Some os custos para obter o Valor Base:**
    *   **Preço por Tamanho do Site ('siteSize'):**
        *   "One Page": R$ 1.200,00
        *   "Pequeno (até 5 páginas)": R$ 2.500,00
        *   "Médio (6 a 10 páginas)": R$ 4.000,00
        *   "Grande (+10 páginas ou E-commerce)": R$ 7.000,00
    *   **Preço por Funcionalidades ('features'):** Some os valores para CADA funcionalidade marcada.
        *   'Integração com WhatsApp...': + R$ 150,00
        *   'Blog/Área de Notícias...': + R$ 900,00
        *   'Formulário de Contato avançado': + R$ 300,00
        *   'Área de Login/Membros': + R$ 1.500,00
        *   'Integração com Instagram...': + R$ 400,00
        *   'Multi-idiomas...': + R$ 1.200,00
    *   **Preço por Conteúdo ('contentState'):**
        *   "Tenho o básico...": +15% sobre o valor calculado até aqui.
        *   "Não tenho nada...": +25% sobre o valor calculado até aqui.
        *   "Tenho tudo pronto": +0%

2.  **Calcule o Fator de Urgência (com base no 'deadline'):**
    *   Se o prazo for em **menos de 30 dias** a partir de hoje, adicione **20%** ao Valor Base.
    *   Se o prazo for **entre 31 e 60 dias**, adicione **10%** ao Valor Base.
    *   Se o prazo for **maior que 60 dias** ou não especificado, não adicione nada.

3.  **Determine o Valor Final e a Faixa de Preço ('priceRange'):**
    *   Some o Valor Base + Fator de Urgência para obter o Preço Mínimo.
    *   Some mais 25% ao Preço Mínimo para obter o Preço Máximo.
    *   Formate como "R$ [Preço Mínimo] - R$ [Preço Máximo]". (Use formatação de moeda brasileira e arredonde para duas casas decimais).

4.  **Determine o Prazo ('timeline'):**
    *   "One Page": 2-3 semanas
    *   "Pequeno": 3-5 semanas
    *   "Médio": 5-8 semanas
    *   "Grande": 8-12 semanas
    *   Adicione 1 semana extra para cada 2 funcionalidades.

5.  **Defina o Escopo ('scope'):**
    *   Sempre comece com o tipo de site (ex: "Desenvolvimento de Site One Page").
    *   Liste TODAS as 'features' marcadas pelo cliente.
    *   Sempre inclua "Design Responsivo (adaptável para celulares e tablets)".
    *   Sempre inclua "Otimização Básica de SEO".
    *   Se 'contentState' não for "Tenho tudo pronto", inclua "Curadoria de banco de imagens e auxílio na redação".

6.  **Crie as Observações ('observations'):**
    *   Crie uma nota amigável explicando que os valores são uma estimativa inicial e que o preço final será confirmado após uma reunião de alinhamento para detalhar todos os requisitos.
    *   Se o Fator de Urgência foi aplicado, mencione que o valor considera a prioridade no cronograma.

Execute os cálculos e retorne o JSON final. A moeda é BRL (R$).`,
});


const generateServiceQuoteFlow = ai.defineFlow(
  {
    name: 'generateServiceQuoteFlow',
    inputSchema: ServiceQuoteInputSchema,
    outputSchema: ServiceQuoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar um orçamento.');
    }
    return output;
  }
);
