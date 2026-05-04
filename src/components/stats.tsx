import { Progress } from "@/components/ui/progress"

const skillAreas = [
    { name: "Front-End (React, Next.js, Tailwind)", level: 90 },
    { name: "Back-End (Node.js, Python, PHP)", level: 75 },
    { name: "Mobile (Flutter, Dart)", level: 80 },
    { name: "Bancos de Dados (SQL & NoSQL)", level: 75 },
    { name: "Infraestrutura & Firebase", level: 90 },
    { name: "IA & Automações (Genkit, Python)", level: 75 },
];

export function Stats() {
    return (
        <div className="border-y bg-card/50 py-20 px-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-12 border-l-4 border-primary pl-4">
                  <h2 className="text-3xl font-bold text-foreground">Minhas Habilidades</h2>
                  <p className="text-muted-foreground mt-2">Nível de proficiência nas principais áreas de atuação.</p>
                </div>

                <div className="space-y-8">
                    {skillAreas.map((skill) => (
                        <div key={skill.name}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium text-foreground">{skill.name}</h3>
                                <span className="font-bold text-primary text-sm">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                        </div>
                    ))}
                </div>
                 <div className="mt-12 text-center">
                    <p className="text-lg text-muted-foreground">E tudo isso em mais de <span className="font-bold text-primary">10 anos</span> de experiência.</p>
                </div>
            </div>
        </div>
    );
}
