import Image from 'next/image';

export function About() {
  return (
    <section id="sobre" className="bg-card/20 border-y py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 border-l-4 border-primary pl-4">
          <h2 className="text-3xl font-bold text-foreground">Sobre Mim</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="md:col-span-1 relative">
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg glow-hover">
              <Image
                src="/ruan.jpg"
                alt="Foto de Ruan Andrade"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 font-code">
              Cursando Análise e Desenvolvimento de Sistemas
            </p>
          </div>
          <div className="md:col-span-2 space-y-6 text-xl text-muted-foreground font-handwriting">
            <p>
              33 anos, casado, pai de um filho. Sou neurodivergente com hiperfoco em tecnologia. Desde pequeno, buscava entender como as coisas funcionavam e agora faço parte do grupo dos que fazem acontecer.
            </p>
            <p>
              Como profissional independente, cuido de todo o ciclo de vida de um projeto: do levantamento de requisitos à prototipação, passando pela codificação e testes, até a entrega final ao cliente. Trabalho com metodologias ágeis para garantir resultados de nível internacional.
            </p>
            <p>
              Atualmente estou nesse fatídico, mas recompensador, caminho do empreendedorismo, buscando meu espaço a fim de me tornar referência na área.
            </p>
            <p className="font-bold text-foreground text-2xl border-l-4 border-primary pl-4 italic">
              "Para mim, o Céu é o limite."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
