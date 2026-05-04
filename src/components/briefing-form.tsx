"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Separator } from './ui/separator';
import { useFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const briefingSchema = z.object({
  objective: z.string().min(1, 'Por favor, selecione um objetivo.'),
  vibeStyle: z.number().min(0).max(2).default(1),
  vibeTone: z.number().min(0).max(2).default(1),
  vibeVisual: z.number().min(0).max(2).default(1),
  hasLogo: z.string().min(1, 'Por favor, selecione uma opção.'),
  colorPalette: z.string().optional(),
  geometry: z.string().min(1, 'Por favor, selecione uma preferência.'),
  
  siteSize: z.string().min(1, 'Por favor, estime o tamanho do site.'),
  features: z.array(z.string()).optional(),
  contentState: z.string().min(1, 'Por favor, informe sobre o conteúdo.'),

  reference1: z.string().optional(),
  reference1Likes: z.string().optional(),
  reference2: z.string().optional(),
  reference2Likes: z.string().optional(),
  deadline: z.string().optional(),
  investment: z.string().min(1, 'Por favor, selecione uma expectativa.'),
  
  clientName: z.string().min(2, "O nome é obrigatório."),
  clientEmail: z.string().email("O email é inválido."),
});

type BriefingFormData = z.infer<typeof briefingSchema>;

const vibeLabels = {
  style: ['Clássico/Tradicional', 'Equilibrado', 'Moderno/Inovador'],
  tone: ['Sério/Corporativo', 'Neutro', 'Descontraído/Amigável'],
  visual: ['Minimalista/Limpo', 'Balanceado', 'Rico em Detalhes/Colorido'],
};

export function BriefingForm() {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      vibeStyle: 1,
      vibeTone: 1,
      vibeVisual: 1,
      features: [],
    },
  });

  const onSubmit = (data: BriefingFormData) => {
    if (!firestore) return;

    // 1. Prepare data for Firestore
    const serviceRequestData = {
      customerName: data.clientName,
      customerEmail: data.clientEmail,
      serviceType: data.objective,
      details: JSON.stringify(data, null, 2), // Store full briefing as JSON string
      status: 'Pending',
      requestDate: serverTimestamp(),
    };

    // 2. Save data to Firestore (non-blocking)
    const serviceRequestsCollection = collection(firestore, 'service_requests');
    addDocumentNonBlocking(serviceRequestsCollection, serviceRequestData);

    // 3. Create WhatsApp message
    let message = `*--- NOVO BRIEFING DE PROJETO ---*\n\n`;
    message += `Olá! Segue o briefing preenchido para um novo site.\n\n`;
    message += `*Contato:*\n- Nome: ${data.clientName}\n- Email: ${data.clientEmail}\n\n`;
    message += `*--- 1. O BÁSICO ---*\n\n`;
    message += `*Principal Objetivo:* ${data.objective}\n\n`;
    message += `*A "Vibe" do Site:*\n`;
    message += `- Estilo: ${vibeLabels.style[data.vibeStyle]}\n`;
    message += `- Tom: ${vibeLabels.tone[data.vibeTone]}\n`;
    message += `- Visual: ${vibeLabels.visual[data.vibeVisual]}\n\n`;
    message += `*Cores e Formas:*\n`;
    message += `- Possui logo? ${data.hasLogo}\n`;
    if (data.colorPalette) message += `- Paleta de Cores: ${data.colorPalette}\n`;
    message += `- Geometria preferida: ${data.geometry}\n\n`;
    message += `*--- 2. O ESCOPO ---*\n\n`;
    message += `*Tamanho do Site:* ${data.siteSize}\n`;
    if (data.features && data.features.length > 0) {
      message += `*Funcionalidades Essenciais:* ${data.features.join(', ')}\n`;
    }
    message += `*Estado do Conteúdo:* ${data.contentState}\n\n`;
    message += `*--- 3. REFERÊNCIAS E LOGÍSTICA ---*\n\n`;
    if(data.reference1) message += `*Referência 1:* ${data.reference1}\n- *Gostou de:* ${data.reference1Likes || 'Não especificado'}\n`;
    if(data.reference2) message += `*Referência 2:* ${data.reference2}\n- *Gostou de:* ${data.reference2Likes || 'Não especificado'}\n`;
    if(data.deadline) message += `*Prazo Desejado:* ${data.deadline}\n`;
    message += `*Expectativa de Investimento:* ${data.investment}\n\n`;
    message += `Aguardando próximos passos!`;
    
    // 4. Open WhatsApp and reset form
    const whatsappUrl = `https://wa.me/5531973067627?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'Briefing Enviado!',
      description: 'Seus dados foram enviados. Você será redirecionado para o WhatsApp para confirmar.',
    });
    form.reset();
  };

  const featuresList = [
    { id: 'whatsapp', label: 'Integração com WhatsApp (Botão flutuante)' },
    { id: 'blog', label: 'Blog/Área de Notícias gerenciável' },
    { id: 'form', label: 'Formulário de Contato avançado' },
    { id: 'login', label: 'Área de Login/Membros' },
    { id: 'instagram', label: 'Integração com Instagram (Feed no site)' },
    { id: 'multilang', label: 'Multi-idiomas (Inglês/Espanhol)' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4">
      <Card className="shadow-lg glow-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Briefing de Projeto</CardTitle>
          <CardDescription className="text-lg">Preencha o formulário abaixo para começarmos a dar vida ao seu projeto.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              {/* SECTION 1 */}
              <div className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold border-l-4 border-primary pl-3">1. O Básico (Identidade e Propósito)</h3>
                    <p className="text-muted-foreground pl-4">Essas perguntas definem a "alma" do projeto.</p>
                </div>
                <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-bold">Seu Nome Completo</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-bold">Seu Melhor Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator/>
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">1.1 Qual o principal objetivo do site?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Loja Virtual/E-commerce" /></FormControl>
                            <FormLabel className="font-normal">Vender produtos diretamente (Loja Virtual/E-commerce)</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Gerar Leads/Orçamentos" /></FormControl>
                            <FormLabel className="font-normal">Gerar orçamentos/Leads (Site Institucional com formulários)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Portfólio" /></FormControl>
                            <FormLabel className="font-normal">Apresentar meu portfólio/trabalho (Portfólio)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Blog/Notícias" /></FormControl>
                            <FormLabel className="font-normal">Informar ou educar (Blog/Notícias)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Landing Page" /></FormControl>
                            <FormLabel className="font-normal">Landing Page (Página única para venda de um produto específico)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <Label className="font-bold">1.2 Se o seu site fosse uma pessoa, como ela seria? (A Vibe)</Label>
                  <VibeSlider control={form.control} name="vibeStyle" labels={vibeLabels.style} />
                  <VibeSlider control={form.control} name="vibeTone" labels={vibeLabels.tone} />
                  <VibeSlider control={form.control} name="vibeVisual" labels={vibeLabels.visual} />
                </div>

                <div className="space-y-4">
                    <Label className="font-bold">1.3 Sobre Cores e Formas</Label>
                    <FormField
                        control={form.control}
                        name="hasLogo"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Você já tem uma logo/identidade visual pronta?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="Sim" /></FormControl>
                                    <FormLabel className="font-normal">Sim</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="Não" /></FormControl>
                                    <FormLabel className="font-normal">Não, preciso de ajuda</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colorPalette"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Se não, cite 2 ou 3 cores que você gosta.</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Azul marinho, Dourado, Branco" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="geometry"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>O que te agrada mais visualmente?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="Cantos Retos" /></FormControl>
                                    <FormLabel className="font-normal">Cantos Retos (força, seriedade, estabilidade)</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="Cantos Arredondados" /></FormControl>
                                    <FormLabel className="font-normal">Cantos Arredondados (modernidade, amabilidade, fluidez)</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
              </div>

              <Separator />

              {/* SECTION 2 */}
              <div className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold border-l-4 border-primary pl-3">2. O Escopo (Para Precificação)</h3>
                    <p className="text-muted-foreground pl-4">Aqui você define o tamanho do trabalho.</p>
                </div>
                 <FormField
                  control={form.control}
                  name="siteSize"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">2.1 Qual o tamanho estimado do site?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="One Page" /></FormControl>
                            <FormLabel className="font-normal">One Page: Todo o conteúdo em uma única página.</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Pequeno (até 5 páginas)" /></FormControl>
                            <FormLabel className="font-normal">Pequeno: Até 5 páginas (Ex: Home, Sobre, Serviços, Contato).</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Médio (6 a 10 páginas)" /></FormControl>
                            <FormLabel className="font-normal">Médio: De 6 a 10 páginas.</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Grande (+10 páginas ou E-commerce)" /></FormControl>
                            <FormLabel className="font-normal">Grande: Mais de 10 páginas ou Loja Virtual.</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="font-bold">2.2 Funcionalidades Específicas</FormLabel>
                            <p className="text-sm text-muted-foreground">Marque o que é essencial para o lançamento.</p>
                        </div>
                        {featuresList.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="features"
                            render={({ field }) => {
                                return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.label)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.label])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.label
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                  control={form.control}
                  name="contentState"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">2.3 Conteúdo (Textos e Imagens)</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Tenho tudo pronto" /></FormControl>
                            <FormLabel className="font-normal">Já tenho tudo pronto (textos e fotos profissionais).</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Tenho o básico" /></FormControl>
                            <FormLabel className="font-normal">Tenho apenas o básico, vou precisar de ajuda/banco de imagens.</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Não tenho nada" /></FormControl>
                            <FormLabel className="font-normal">Não tenho nada, preciso que inclua a criação de conteúdo.</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <Separator />

              {/* SECTION 3 */}
              <div className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold border-l-4 border-primary pl-3">3. Referências e Logística</h3>
                    <p className="text-muted-foreground pl-4">Para alinhar expectativas.</p>
                </div>
                <div>
                    <Label className="font-bold">3.1 O "Muro das Inspirações"</Label>
                    <p className="text-sm text-muted-foreground mb-4">Cole 1 ou 2 links de sites que você acha bonitos e diga o que gostou.</p>
                    <div className="space-y-4">
                         <FormField
                            control={form.control}
                            name="reference1"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Link 1</FormLabel>
                                <FormControl><Input placeholder="https://www.apple.com" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="reference1Likes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Gostei de:</FormLabel>
                                <FormControl><Textarea placeholder="Ex: o menu, as cores, as animações..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="reference2"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Link 2</FormLabel>
                                <FormControl><Input placeholder="https://www.stripe.com" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="reference2Likes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Gostei de:</FormLabel>
                                <FormControl><Textarea placeholder="Ex: a simplicidade, a forma como mostram os produtos..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-bold">3.2 Prazo e Investimento</FormLabel>
                        <p className="text-sm text-muted-foreground">Para quando você precisa do site no ar? (Data aproximada)</p>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="investment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">Qual sua expectativa de investimento?</FormLabel>
                      <p className="text-sm text-muted-foreground">Isso me ajuda a sugerir a melhor tecnologia para o seu caso.</p>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Baixo (solução simples/template)" /></FormControl>
                            <FormLabel className="font-normal">Baixo (solução simples/template)</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Médio (personalizado mas funcional)" /></FormControl>
                            <FormLabel className="font-normal">Médio (personalizado mas funcional)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Alto (totalmente exclusivo e robusto)" /></FormControl>
                            <FormLabel className="font-normal">Alto (totalmente exclusivo e robusto)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={!firestore}>Enviar Briefing para Orçamento</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for Vibe sliders
function VibeSlider({ control, name, labels }: { control: any, name: "vibeStyle" | "vibeTone" | "vibeVisual", labels: string[] }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                     <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{labels[0]}</span>
                        <span>{labels[2]}</span>
                    </div>
                    <FormControl>
                         <Slider
                            min={0}
                            max={2}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                        />
                    </FormControl>
                    <FormLabel className="text-center block font-bold text-primary">{labels[field.value]}</FormLabel>
                </FormItem>
            )}
        />
    )
}

    