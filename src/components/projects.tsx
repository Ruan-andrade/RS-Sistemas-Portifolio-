"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const projects = [
  {
    title: 'Elo Terapêutico',
    year: '2024',
    description: `Elo Terapêutico é uma plataforma completa de gestão para a área de saúde mental, projetada para conectar psicólogos, pacientes e clínicas de forma segura, intuitiva e eficiente. A plataforma oferece painéis dedicados para cada tipo de usuário, com ferramentas que vão desde a gestão de agendamentos e prontuários até recursos avançados com Inteligência Artificial para potencializar a prática clínica.`,
    tags: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'ShadCN', 'Firebase', 'Google AI', 'Genkit'],
    imageUrl: '/services/eloterapeutico.png',
    liveUrl: 'https://studio--psion-yin1n.us-central1.hosted.app',
    fullDescription: true,
  },
  {
    title: 'Gasvec',
    year: '2025',
    description:
      'Site para divulgação de empresa convertedora de GNV, com serviços de venda, manutenção, instalação e remoção de Gás veicular de 5° Geração.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    imageUrl: '/services/gasvec.png',
    liveUrl: 'https://gasvec.com.br/previa/index.html',
  },
  {
    title: 'SitePlay',
    year: '2023',
    description: `O projeto consiste no desenvolvimento do website institucional para o grupo cristão Vocal Play. O site serve como a principal plataforma de presença digital do grupo, projetado para ser visualmente atraente, informativo e funcional. Além disso, o projeto inclui uma ferramenta interna inovadora, alimentada por Inteligência Artificial, para a geração automática de biografias de artistas.`,
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'ShadCN/UI', 'Lucide React', 'React Hook Form', 'Zod', 'Genkit', 'Gemini'],
    imageUrl: '/services/siteplay.png',
    liveUrl: 'https://studio--studio-7763520633-4a282.us-central1.hosted.app',
    fullDescription: true,
  },
  {
    title: 'SMPGN PRO / RetailVerse',
    year: '2025',
    description: 'O SMPGN PRO, também conhecido como RetailVerse, é um sistema de gestão empresarial (ERP) completo, construído no modelo SaaS (Software as a Service), focado em atender às necessidades do setor de varejo. Sua arquitetura é multi-inquilino (multi-tenant), o que significa que uma única instalação do sistema pode servir múltiplos clientes (empresas/inquilinos), mantendo os dados de cada um de forma isolada e segura.',
    tags: ['Next.js', 'TypeScript', 'Firebase', 'Genkit', 'React', 'ShadCN UI', 'Tailwind CSS', 'Electron'],
    imageUrl: '/services/SMPGN.png',
    liveUrl: '#',
    fullDescription: true,
  }
];

export function Projects() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

  return (
    <section id="projetos" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 border-l-4 border-primary pl-4">
        <h2 className="text-3xl font-bold text-foreground">
          Projetos Selecionados
        </h2>
      </div>

      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {projects.map((project, index) => {
            const fullDescription = 'O **SMPGN PRO**, também conhecido como **RetailVerse**, é um sistema de gestão empresarial (ERP) completo, construído no modelo SaaS (*Software as a Service*), focado em atender às necessidades do setor de varejo.\n\nSua arquitetura é **multi-inquilino** (*multi-tenant*), o que significa que uma única instalação do sistema pode servir múltiplos clientes (empresas/inquilinos), mantendo os dados de cada um de forma isolada e segura.\n\n## Tecnologias Utilizadas\n\nO sistema foi construído com uma stack de tecnologias modernas para garantir performance, escalabilidade e uma excelente experiência de usuário.\n\n- **Framework Principal:** **Next.js** (com App Router) para uma renderização híbrida e otimizada.\n- **Linguagem:** **TypeScript** para garantir segurança e robustez no código.\n- **Banco de Dados e Autenticação:** **Firebase**, utilizando **Firestore** para o banco de dados NoSQL em tempo real e **Firebase Authentication** para a gestão de usuários.\n- **Inteligência Artificial:** **Genkit** para integrar funcionalidades de IA, como processamento de documentos e geração de relatórios.\n- **Interface e Estilização:**\n  - **React** como biblioteca principal para a construção da interface.\n  - **ShadCN UI** para uma base de componentes de UI acessíveis e customizáveis.\n  - **Tailwind CSS** para a estilização utilitária e responsiva.\n- **Empacotamento Desktop (Opcional):** **Electron** para criar uma versão instalável do aplicativo para desktop.';
            
            return (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="glow-hover group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <CardHeader className="p-0">
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-primary">
                          {project.title}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0">
                          {project.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 pt-4 space-y-4">
                      {project.fullDescription ? (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="p-0 text-sm text-muted-foreground hover:no-underline text-left">
                              <span className="line-clamp-3">{project.title === 'SMPGN PRO / RetailVerse' ? 'O SMPGN PRO, também conhecido como RetailVerse, é um sistema de gestão empresarial (ERP) completo, construído no modelo SaaS (Software as a Service), focado em atender às necessidades do setor de varejo.' : project.description}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 text-muted-foreground">
                               {project.title === 'SMPGN PRO / RetailVerse' ? fullDescription.split('\n\n').map((p, i) => <p key={i} className="mb-2">{p.replace(/\*\*/g, '').replace(/\*/g, '')}</p>) : project.description}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <CardDescription>
                          {project.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-bold text-primary dark:text-primary"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 pt-6">
                      <Button asChild className="w-full" disabled={project.liveUrl === '#'}>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2" /> Ver Projeto
                        </a>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          )})}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
       <div className="mt-12 text-center">
            <Button asChild variant="ghost">
                <a href="#">
                    Ver todos os projetos <ArrowRight className="ml-2" />
                </a>
            </Button>
        </div>
    </section>
  );
}
