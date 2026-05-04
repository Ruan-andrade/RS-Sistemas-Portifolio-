"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DraftingCompass, Download, Rocket } from 'lucide-react';

const styles = [
  { id: 'modern', label: 'Moderno', description: 'Linhas limpas, minimalista e focado em tipografia.' },
  { id: 'classic', label: 'Clássico', description: 'Elegante, estruturado e com um toque tradicional.' },
  { id: 'creative', label: 'Criativo', description: 'Ousado, com cores vibrantes e layouts assimétricos.' },
];

const sections = [
  { id: 'hero', label: 'Seção Principal (Hero)' },
  { id: 'about', label: 'Sobre Nós' },
  { id: 'services', label: 'Serviços/Produtos' },
  { id: 'testimonials', label: 'Depoimentos' },
  { id: 'contact', label: 'Formulário de Contato' },
];

type PrototypeConfig = {
  companyName: string;
  style: string;
  sections: string[];
};

export function SiteSemGrilo() {
  const [step, setStep] = useState(1);
  const [prototypeConfig, setPrototypeConfig] = useState<PrototypeConfig>({
    companyName: '',
    style: 'modern',
    sections: ['hero', 'contact'],
  });
  
  const handleHire = (plan: 'basic' | 'pro') => {
    const { companyName, style, sections: selectedSections } = prototypeConfig;
    let message: string;

    if (plan === 'basic') {
      message = `Olá! Gostaria de contratar o plano "Grilo Basic" (R$ 49,90) para o protótipo que criei.\n\nDetalhes do Protótipo:\n- Nome da Empresa: ${companyName}\n- Estilo: ${style}\n- Seções: ${selectedSections.join(', ')}\n\nQuero receber o código-fonte para publicar por conta própria.`;
    } else {
      message = `Olá! Gostaria de contratar o plano "Grilo Pro" para transformar meu protótipo em um site completo.\n\nDetalhes do Protótipo:\n- Nome da Empresa: ${companyName}\n- Estilo: ${style}\n- Seções: ${selectedSections.join(', ')}\n\nAguardo o contato para definirmos os próximos passos (domínio, hospedagem, etc.).`;
    }
    
    const whatsappUrl = `https://wa.me/5531973067627?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleSection = (sectionId: string) => {
    setPrototypeConfig(prev => {
      const newSections = prev.sections.includes(sectionId)
        ? prev.sections.filter(id => id !== sectionId)
        : [...prev.sections, sectionId];
      return { ...prev, sections: newSections };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName" className="text-lg font-semibold">Qual o nome do seu negócio ou projeto?</Label>
              <Input
                id="companyName"
                placeholder="Ex: Minha Barbearia"
                value={prototypeConfig.companyName}
                onChange={(e) => setPrototypeConfig({ ...prototypeConfig, companyName: e.target.value })}
                className="mt-2 text-base"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Qual a "sensação" que seu site deve passar?</h3>
              <RadioGroup
                value={prototypeConfig.style}
                onValueChange={(value) => setPrototypeConfig({ ...prototypeConfig, style: value })}
                className="space-y-3"
              >
                {styles.map(s => (
                  <Label key={s.id} htmlFor={s.id} className="flex items-start gap-4 rounded-md border p-4 cursor-pointer hover:bg-secondary has-[[data-state=checked]]:border-primary">
                    <RadioGroupItem value={s.id} id={s.id} />
                    <div className="grid gap-1.5">
                      <span className="font-bold">{s.label}</span>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <Button onClick={() => setStep(2)} disabled={!prototypeConfig.companyName} className="w-full">Próximo Passo</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Quais seções seu site precisa ter?</h3>
              <div className="space-y-3">
                {sections.map(s => (
                  <Label key={s.id} htmlFor={s.id} className="flex items-center gap-3 rounded-md border p-4 cursor-pointer hover:bg-secondary has-[[data-state=checked]]:border-primary">
                    <Checkbox
                      id={s.id}
                      checked={prototypeConfig.sections.includes(s.id)}
                      onCheckedChange={() => toggleSection(s.id)}
                    />
                    <span className="font-medium">{s.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="w-full">Voltar</Button>
              <Button onClick={() => setStep(3)} className="w-full">Gerar Protótipo</Button>
            </div>
          </div>
        );
      case 3:
        return (
           <div className="text-center">
            <h3 className="text-2xl font-bold text-primary">Seu Protótipo está Pronto!</h3>
            <p className="text-muted-foreground mt-2 mb-6">Aprovou o resultado? Escolha um plano para dar vida ao seu site.</p>
            
            <Card className="mb-8 text-left bg-secondary/30 border-primary/20 overflow-hidden">
              <CardHeader>
                <CardTitle>{prototypeConfig.companyName || "Meu Site"}</CardTitle>
                <CardDescription>Estilo: {styles.find(s => s.id === prototypeConfig.style)?.label}</CardDescription>
              </CardHeader>
              <CardContent className='font-sans text-sm p-0'>
                <div className='w-full aspect-video relative'>
                  <Image
                    src="https://images.unsplash.com/photo-1559028006-448665bd7c24?w=1600&q=80"
                    alt="Pré-visualização do protótipo do site"
                    layout="fill"
                    objectFit="cover"
                    className="border-t border-b border-primary/20"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold mb-2">Seções Incluídas:</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {prototypeConfig.sections.map(s => <li key={s}>{sections.find(sec => sec.id === s)?.label}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="text-left">
                    <CardHeader>
                        <Download className="text-primary mb-2"/>
                        <CardTitle>Grilo Basic</CardTitle>
                        <CardDescription>Baixe o código e publique onde quiser.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">R$ 49,90</p>
                        <p className='text-sm text-muted-foreground'>Pagamento único</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleHire('basic')} className="w-full">Contratar Basic</Button>
                    </CardFooter>
                </Card>
                 <Card className="text-left border-2 border-primary shadow-lg">
                    <CardHeader>
                        <Rocket className="text-primary mb-2"/>
                        <CardTitle>Grilo Pro</CardTitle>
                        <CardDescription>Nós cuidamos de tudo para você.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">Sob Consulta</p>
                         <p className='text-sm text-muted-foreground'>Domínio + Hospedagem + Suporte</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleHire('pro')} className="w-full">Contratar Pro</Button>
                    </CardFooter>
                </Card>
            </div>
            <Button onClick={() => setStep(1)} variant="link" className="mt-8">Criar outro protótipo</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="site-sem-grilo" className="border-t bg-card/20 py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1 mb-4">
             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
              Site Sem Grilo
            </h2>
          </div>
          <p className="mt-2 text-xl text-muted-foreground">
            Sua ideia, nosso código. <strong className="text-foreground">Zero complicação.</strong>
          </p>
           <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie um rascunho funcional do seu site em minutos, sem precisar entender de design ou programação. Se gostar, nós transformamos em realidade.
          </p>
        </div>

        <Card className="shadow-lg glow-hover max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <DraftingCompass />
              Monte seu Protótipo
            </CardTitle>
            <CardDescription>Siga os passos e veja a mágica acontecer.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
