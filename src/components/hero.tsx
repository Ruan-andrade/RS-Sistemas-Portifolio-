import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <p className="mb-4 font-bold text-primary">
        Olá, mundo. Eu sou Ruan Andrade.
      </p>
      <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
        Transformo códigos em soluções e{' '}
        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-primary dark:to-blue-500">
          ideias em realidade
        </span>
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
        Profissional Híbrido: Especialista em Infraestrutura de Redes e Desenvolvimento Full Stack. Foco em desenvolvimento web e mobille além de soluções com uso de Inteligência Artificial focada 100% no seu business.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg" className="font-bold shadow-lg">
          <a href="#servicos">Contratar Serviços</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#projetos">Ver Portfólio</a>
        </Button>
      </div>
    </section>
  );
}
