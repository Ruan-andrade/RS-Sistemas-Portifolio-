"use client";

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const fixedServices = [
  {
    title: 'Suporte Remoto',
    tag: '1 HORA',
    price: 'R$ 150,00',
    description: 'Solução de problemas e suporte técnico imediato para suas necessidades urgentes.',
  },
  {
    title: 'Setup Cloud/Server',
    tag: 'PROJETO',
    price: 'A partir de R$ 450,00',
    description: 'Configuração inicial de servidores e serviços em nuvem (Firebase, AWS, etc).',
  },
  {
    title: 'Landing Page Padrão',
    tag: 'WEB',
    price: 'A partir de R$ 800,00',
    description: 'Criação de uma página de aterrissagem otimizada para conversão e presença online.',
  },
  {
    title: 'Desenvolvimento de App Mobile (MVP)',
    tag: 'MOBILE',
    price: 'A partir de R$ 2.500,00',
    description: 'Criação de um Produto Mínimo Viável (MVP) para validar sua ideia no mercado mobile.',
  },
  {
    title: 'Criação de APIs e Integrações',
    tag: 'BACK-END',
    price: 'A partir de R$ 1.800,00',
    description: 'Desenvolvimento de APIs RESTful e integração entre diferentes sistemas e serviços.',
  }
];

export function Services() {
  const plugin = React.useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="servicos" className="border-t py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-foreground">Contrate Serviços</h2>
          <p className="text-muted-foreground">Abaixo estão alguns dos nossos pacotes de preço fixo. Para projetos personalizados, entre em contato.</p>
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
          <CarouselContent className="-ml-4">
            {fixedServices.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1 h-full">
                  <Card
                    className='glow-hover flex h-full flex-col shadow-sm transition-all'
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="font-bold text-foreground text-xl">{service.title}</CardTitle>
                        <Badge variant="outline">{service.tag}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-6 pt-0">
                      <p className="text-muted-foreground flex-1">{service.description}</p>
                      <p className="mt-4 text-2xl font-bold text-primary">{service.price}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>

        <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-foreground">Precisa de algo diferente?</h3>
            <p className="text-muted-foreground mt-2 mb-6">Entre em contato para discutir seu projeto e obter um orçamento personalizado.</p>
            <Button asChild size="lg">
                <a href="#contato">
                    Entrar em Contato
                </a>
            </Button>
        </div>
      </div>
    </section>
  );
}
