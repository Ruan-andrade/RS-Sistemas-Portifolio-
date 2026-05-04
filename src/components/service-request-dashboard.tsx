'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { Sparkles, Bot, Loader2, Link, FlaskConical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ServiceQuoteOutput, generateServiceQuote } from '@/ai/flows/generate-service-quote';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

interface ServiceRequest {
    id: string;
    customerName: string;
    customerEmail: string;
    serviceType: string;
    status: 'Pending' | 'Quoted' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed' | 'Cancelled';
    requestDate: { seconds: number; nanoseconds: number } | null;
    details: string;
    publicId?: string;
    quoteDetails?: string;
}

export function ServiceRequestDashboard() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableQuote, setEditableQuote] = useState<ServiceQuoteOutput | null>(null);
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);

  const serviceRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'service_requests'), orderBy('requestDate', 'desc'));
  }, [firestore]);

  const { data: serviceRequests, isLoading, error } = useCollection<ServiceRequest>(serviceRequestsQuery);
  
  useEffect(() => {
    // When the dialog closes, reset the editable quote
    if (!activeRequest) {
      setEditableQuote(null);
    } else if (activeRequest.quoteDetails) {
        // If the request already has a quote, load it into the editable state
        try {
            setEditableQuote(JSON.parse(activeRequest.quoteDetails));
        } catch(e) {
            console.error("Failed to parse existing quote details:", e);
            setEditableQuote(null); // Reset if parsing fails
        }
    }
  }, [activeRequest]);

  const handleGenerateQuote = async (request: ServiceRequest) => {
    setActiveRequest(request);
     // If a quote already exists, just show it for editing.
    if(request.quoteDetails) {
        try {
            setEditableQuote(JSON.parse(request.quoteDetails));
        } catch(e) {
            console.error("Failed to parse existing quote details:", e);
            setEditableQuote(null);
        }
        return;
    }
    setIsGenerating(true);
    setEditableQuote(null);
    try {
      const quote = await generateServiceQuote(request.details);
      setEditableQuote(quote);
    } catch (e) {
      console.error("Erro ao gerar orçamento:", e);
      toast({
        variant: 'destructive',
        title: 'Erro de IA',
        description: 'Não foi possível gerar o orçamento. Tente novamente.',
      });
      setActiveRequest(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToCustomer = async () => {
    if (!editableQuote || !activeRequest || !firestore) return;
    
    setIsSaving(true);
    
    try {
        const requestRef = doc(firestore, 'service_requests', activeRequest.id);
        const publicId = activeRequest.publicId || nanoid(12);

        // 1. Save the quote and publicId to Firestore
        await updateDoc(requestRef, {
            quoteDetails: JSON.stringify(editableQuote),
            publicId: publicId,
            status: 'Quoted',
            updatedAt: serverTimestamp()
        });

        // 2. Prepare WhatsApp message with the public link
        const proposalUrl = `${window.location.origin}/proposta/${publicId}`;

        let message = `*Olá, ${activeRequest.customerName}!* 👋\n\n`;
        message += `Preparei uma proposta detalhada para o seu projeto *${activeRequest.serviceType}*.\n\n`;
        message += `Você pode visualizar, aprovar ou solicitar ajustes diretamente no link abaixo:\n`;
        message += `🔗 *${proposalUrl}*\n\n`;
        message += `Qualquer dúvida, estou à disposição!\n\n`;
        message += `Atenciosamente,\nWilson Ruan\nRS Sistemas`;

        const whatsappUrl = `https://wa.me/5531973067627?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
            title: "Proposta Salva e Pronta para Envio!",
            description: "A proposta foi salva e o link de aceite gerado.",
        });

        // Close the dialog
        setActiveRequest(null);

    } catch (e) {
        console.error("Error saving quote:", e);
        toast({
            variant: 'destructive',
            title: "Erro ao Salvar",
            description: "Não foi possível salvar a proposta no banco de dados."
        })
    } finally {
        setIsSaving(false);
    }
  }

  const handleCloseDialog = () => {
    if (!isGenerating && !isSaving) {
      setActiveRequest(null);
    }
  }

  const handlePrototypeClick = (requestId: string) => {
    router.push(`/lab/${requestId}`);
  }

  const statusColors: Record<ServiceRequest['status'], string> = {
    Pending: 'bg-yellow-500 hover:bg-yellow-600',
    'In Progress': 'bg-blue-500 hover:bg-blue-600',
    Quoted: 'bg-purple-500 hover:bg-purple-600',
    Approved: 'bg-green-500 hover:bg-green-600',
    Rejected: 'bg-red-500 hover:bg-red-600',
    Completed: 'bg-teal-500 hover:bg-teal-600',
    Cancelled: 'bg-gray-500 hover:bg-gray-600',
  };

  const getButtonLabel = (request: ServiceRequest) => {
    if (request.quoteDetails) return "Ver/Editar Proposta";
    return "Gerar Orçamento com IA";
  }


  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Erro ao carregar as solicitações: {error.message}</p>;
  }

  if (!serviceRequests || serviceRequests.length === 0) {
    return <p>Nenhuma solicitação de serviço encontrada.</p>;
  }

  return (
    <>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {serviceRequests.map((request) => (
        <Card key={request.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.serviceType}</CardTitle>
                <Badge className={statusColors[request.status]}>{request.status}</Badge>
            </div>
            <CardDescription>{request.customerName} - {request.customerEmail}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
             <p className="text-sm text-muted-foreground font-semibold">Prazo desejado:</p>
             <p className="text-sm text-muted-foreground line-clamp-3">{(request.details && JSON.parse(request.details).deadline) ? format(new Date(JSON.parse(request.details).deadline), "dd/MM/yyyy") : 'Sem prazo definido'}</p>
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-2">
             <Button onClick={() => handleGenerateQuote(request)} disabled={isGenerating && activeRequest?.id === request.id}>
                {isGenerating && activeRequest?.id === request.id ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                {getButtonLabel(request)}
             </Button>
             <p className="text-xs text-muted-foreground text-center">
              Recebido em: {request.requestDate ? format(new Date(request.requestDate.seconds * 1000), "dd 'de' MMM, yyyy", { locale: ptBR }) : 'Data indisponível'}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>

    {/* Alert Dialog for Quote Generation */}
     <AlertDialog open={!!activeRequest} onOpenChange={handleCloseDialog}>
        <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle className='flex items-center gap-2'>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
                    {isGenerating ? "Gerando proposta..." : (activeRequest?.quoteDetails ? "Editar Proposta" : "Revisar Proposta Gerada")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {isGenerating 
                        ? "Aguarde um momento enquanto a IA analisa o briefing para criar uma proposta personalizada."
                        : "Abaixo está a proposta. Revise e edite as informações antes de salvar e enviar ao cliente."
                    }
                </AlertDialogDescription>
            </AlertDialogHeader>

            {isGenerating && (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            )}

            {editableQuote && !isGenerating && activeRequest && (
                <div className="text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerName">Cliente</Label>
                        <Input id="customerName" value={activeRequest?.customerName} disabled />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priceRange">Valor Estimado</Label>
                            <Input 
                                id="priceRange" 
                                value={editableQuote.priceRange} 
                                onChange={(e) => setEditableQuote({...editableQuote, priceRange: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeline">Prazo Estimado</Label>
                             <Input 
                                id="timeline" 
                                value={editableQuote.timeline}
                                onChange={(e) => setEditableQuote({...editableQuote, timeline: e.target.value})}
                             />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="scope">Escopo</Label>
                        <Textarea 
                            id="scope"
                            rows={8}
                            value={Array.isArray(editableQuote.scope) ? editableQuote.scope.join('\n') : editableQuote.scope}
                            onChange={(e) => setEditableQuote({...editableQuote, scope: e.target.value.split('\n')})}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="observations">Observações</Label>
                         <Textarea 
                            id="observations" 
                            rows={4}
                            value={editableQuote.observations}
                            onChange={(e) => setEditableQuote({...editableQuote, observations: e.target.value})}
                        />
                    </div>
                </div>
            )}


            <AlertDialogFooter className='mt-4 flex-col sm:flex-row gap-2'>
                <Button variant="ghost" onClick={handleCloseDialog} disabled={isGenerating || isSaving} className="w-full sm:w-auto">Cancelar</Button>
                <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto'>
                  <Button variant="outline" onClick={() => handlePrototypeClick(activeRequest!.id)} disabled={isGenerating || isSaving || !editableQuote} className="w-full">
                      <FlaskConical className="mr-2" />
                      Protótipo
                  </Button>
                  <Button onClick={handleSendToCustomer} disabled={isGenerating || isSaving || !editableQuote} className="w-full">
                      {isSaving ? <Loader2 className='animate-spin mr-2' /> : <Link className="mr-2" />}
                      Salvar e Enviar
                  </Button>
                </div>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
