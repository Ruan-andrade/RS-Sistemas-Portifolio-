'use client';

import { useState } from 'react';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { generateLayout, LayoutElement } from '@/ai/flows/generate-layout-flow';
import { Loader2, Wand2 } from 'lucide-react';

interface ServiceRequest {
    id: string;
    customerName: string;
    serviceType: string;
    details: string;
}

export function LabView({ serviceRequestId }: { serviceRequestId: string }) {
    const { firestore } = useFirebase();
    const [layout, setLayout] = useState<LayoutElement[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'service_requests', serviceRequestId);
    }, [firestore, serviceRequestId]);

    const { data: request, isLoading: isRequestLoading } = useDoc<ServiceRequest>(requestRef);

    const handleGenerateLayout = async () => {
        if (!request) return;
        setIsLoading(true);
        setError(null);
        setLayout(null);
        try {
            const generatedLayout = await generateLayout(request.details);
            setLayout(generatedLayout);
        } catch (e) {
            console.error(e);
            setError('Falha ao gerar o protótipo. A IA pode estar sobrecarregada.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Dynamically render components based on the layout from the AI
    const renderElement = (element: LayoutElement, index: number) => {
        switch (element.component) {
            case 'Header':
                return (
                    <header key={index} className="bg-gray-800 text-white p-6 shadow-md">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-2xl font-bold">{element.props.title}</h1>
                            <nav className="space-x-4">
                                {(element.props.navLinks as string[]).map(link => (
                                    <a key={link} href="#" className="hover:text-gray-300">{link}</a>
                                ))}
                            </nav>
                        </div>
                    </header>
                );
            case 'Hero':
                return (
                    <section key={index} className="bg-gray-100 dark:bg-gray-900 py-20 px-4 text-center">
                         <h2 className="text-4xl font-bold mb-4">{element.props.title}</h2>
                         <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{element.props.subtitle}</p>
                         <Button size="lg">{element.props.cta}</Button>
                    </section>
                )
            case 'About':
                return (
                     <section key={index} className="py-20 px-4">
                        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">{element.props.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{element.props.text}</p>
                            </div>
                             <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Imagem</span>
                            </div>
                        </div>
                    </section>
                )
             case 'Services':
                 return (
                    <section key={index} className="bg-gray-100 dark:bg-gray-900 py-20 px-4">
                        <div className="container mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">{element.props.title}</h2>
                             <div className="grid md:grid-cols-3 gap-8">
                                {(element.props.services as {title: string, description: string}[]).map(service =>(
                                    <Card key={service.title}>
                                        <CardHeader>
                                            <CardTitle>{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{service.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            case 'Contact':
                return (
                     <section key={index} className="py-20 px-4">
                         <div className="container mx-auto max-w-2xl">
                             <h2 className="text-3xl font-bold text-center mb-8">{element.props.title}</h2>
                             <p className='text-center mb-8'>{element.props.text}</p>
                             <div className="flex justify-center">
                                 <Button>{element.props.cta}</Button>
                             </div>
                         </div>
                     </section>
                )
             case 'Footer':
                return (
                    <footer key={index} className="bg-gray-800 text-white p-6 text-center">
                         <p>&copy; {new Date().getFullYear()} {element.props.companyName}. Todos os direitos reservados.</p>
                    </footer>
                )
            default:
                return <div key={index} className="p-4 bg-red-200">Componente `{element.component}` desconhecido.</div>;
        }
    };


    if (isRequestLoading) {
        return (
             <div className="container mx-auto max-w-5xl space-y-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
             </div>
        );
    }

    if (!request) {
        return <div className="text-center">Solicitação de serviço não encontrada.</div>;
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                       <span>Laboratório de IA para Protótipos</span>
                        <Button onClick={handleGenerateLayout} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                            {layout ? 'Gerar Novamente' : 'Gerar Protótipo Visual'}
                        </Button>
                    </CardTitle>
                    <CardDescription>
                        Gerando protótipo para: <span className="font-bold">{request.customerName}</span> | Projeto: <span className="font-bold">{request.serviceType}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        {isLoading && (
                             <div className="flex flex-col items-center justify-center h-96 gap-4">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-muted-foreground">A IA está desenhando o layout, isso pode levar um momento...</p>
                            </div>
                        )}
                        {error && <div className="p-8 text-center text-destructive">{error}</div>}
                        {!isLoading && !layout && (
                            <div className="text-center p-8 bg-muted/20">
                                <h3 className="font-semibold text-lg">Pronto para começar?</h3>
                                <p className="text-muted-foreground">Clique no botão "Gerar Protótipo Visual" para que a IA crie uma prévia do site com base no briefing do cliente.</p>
                            </div>
                        )}
                         {layout && (
                            <div className="bg-white dark:bg-black">
                                {layout.map(renderElement)}
                            </div>
                         )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
