'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ServiceQuoteOutput } from '@/ai/flows/generate-service-quote';


interface ServiceRequest {
    id: string;
    customerName: string;
    serviceType: string;
    status: 'Pending' | 'Quoted' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Cancelled';
    quoteDetails: string;
}

export default function ProposalPage({ params }: { params: { publicId: string } }) {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [quote, setQuote] = useState<ServiceQuoteOutput | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!firestore || !params.publicId) return;

            try {
                setIsLoading(true);
                const q = query(collection(firestore, 'service_requests'), where('publicId', '==', params.publicId));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Proposta não encontrada ou link inválido.');
                } else {
                    const docData = querySnapshot.docs[0].data() as DocumentData;
                    const fetchedRequest = { id: querySnapshot.docs[0].id, ...docData } as ServiceRequest;
                    setRequest(fetchedRequest);
                    if (fetchedRequest.quoteDetails) {
                        setQuote(JSON.parse(fetchedRequest.quoteDetails));
                    }
                }
            } catch (e) {
                console.error("Error fetching proposal:", e);
                setError('Ocorreu um erro ao buscar a proposta.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequest();
    }, [firestore, params.publicId]);

    const handleDecision = async (newStatus: 'Approved' | 'Rejected') => {
        if (!firestore || !request) return;

        if (newStatus === 'Rejected' && !feedback.trim()) {
            toast({
                variant: 'destructive',
                title: 'Feedback Necessário',
                description: 'Por favor, informe o motivo da rejeição para que possamos ajustar a proposta.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const requestRef = doc(firestore, 'service_requests', request.id);
            await updateDoc(requestRef, {
                status: newStatus,
                customerFeedback: feedback,
                decisionDate: serverTimestamp(),
            });

            toast({
                title: 'Decisão Enviada!',
                description: `Sua decisão foi registrada. Entraremos em contato em breve.`,
            });
             setRequest(prev => prev ? { ...prev, status: newStatus } : null);

        } catch (e) {
            console.error("Error updating status:", e);
            toast({
                variant: 'destructive',
                title: 'Erro ao Enviar',
                description: 'Não foi possível registrar sua decisão. Tente novamente.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const statusColors: Record<ServiceRequest['status'], string> = {
        Pending: 'bg-yellow-500',
        Quoted: 'bg-purple-500',
        Approved: 'bg-green-500',
        Rejected: 'bg-red-500',
        'In Progress': 'bg-blue-500',
        Completed: 'bg-teal-500',
        Cancelled: 'bg-gray-500',
      };

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-24 pb-12">
                    <div className="mx-auto max-w-3xl px-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                             <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-destructive">{error}</h1>
             </div>
        )
    }

    if (!request || !quote) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Nenhuma proposta encontrada.</h1>
             </div>
        )
    }
    
    const isDecided = request.status === 'Approved' || request.status === 'Rejected';


    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-12 bg-muted/20">
                <div className="mx-auto max-w-3xl px-6">
                    <Card className="shadow-lg">
                        <CardHeader className='border-b pb-4'>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-3xl font-bold text-primary">Proposta Comercial</CardTitle>
                                <Badge className={`${statusColors[request.status]} text-primary-foreground`}>{request.status}</Badge>
                            </div>
                            <CardDescription className="text-lg">
                                Para: {request.customerName} | Projeto: {request.serviceType}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            <div className="grid md:grid-cols-2 gap-6 text-center">
                                <div className='bg-muted/50 p-4 rounded-lg'>
                                    <Label className="text-sm font-semibold text-muted-foreground">Valor Estimado</Label>
                                    <p className="text-2xl font-bold">{quote.priceRange}</p>
                                </div>
                                <div className='bg-muted/50 p-4 rounded-lg'>
                                    <Label className="text-sm font-semibold text-muted-foreground">Prazo de Entrega</Label>
                                    <p className="text-2xl font-bold">{quote.timeline}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg border-l-4 border-primary pl-3">Escopo do Projeto</h3>
                                <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                                    {(Array.isArray(quote.scope) ? quote.scope : quote.scope.split('\n')).map((item, index) => (
                                        item.trim() && <li key={index}>{item.trim()}</li>
                                    ))}
                                </ul>
                            </div>

                             <div className="space-y-3">
                                <h3 className="font-semibold text-lg border-l-4 border-primary pl-3">Observações</h3>
                                <p className="text-muted-foreground pl-4">{quote.observations}</p>
                            </div>
                        </CardContent>
                        
                        {!isDecided ? (
                            <CardFooter className="flex-col items-stretch gap-4 border-t pt-6">
                                <div>
                                    <Label htmlFor="feedback" className="font-semibold">Feedback ou Dúvidas (Opcional se aprovar)</Label>
                                     <Textarea 
                                        id="feedback" 
                                        placeholder="Caso queira rejeitar, por favor, nos diga o motivo. Se tiver dúvidas, pode perguntar aqui..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <Button size="lg" variant="destructive" onClick={() => handleDecision('Rejected')} disabled={isSubmitting}>
                                        <XCircle className="mr-2"/> Rejeitar Proposta
                                     </Button>
                                      <Button size="lg" onClick={() => handleDecision('Approved')} disabled={isSubmitting}>
                                        <CheckCircle className="mr-2"/> Aprovar Proposta
                                     </Button>
                                </div>
                            </CardFooter>
                        ) : (
                             <CardFooter className="flex-col items-center gap-2 border-t pt-6 text-center">
                                <h3 className="font-bold text-lg">Obrigado pela sua resposta!</h3>
                                <p className="text-muted-foreground">Entraremos em contato em breve para os próximos passos.</p>
                             </CardFooter>
                        )}
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}