'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirebase } from '@/firebase';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ServiceRequestDashboard } from '@/components/service-request-dashboard';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const newQuoteSchema = z.object({
  customerName: z.string().min(2, "Nome é obrigatório."),
  customerEmail: z.string().email("Email inválido."),
  serviceType: z.string().min(3, "Tipo de serviço é obrigatório."),
  details: z.string().min(10, "Detalhes são necessários para gerar o orçamento."),
});

type NewQuoteForm = z.infer<typeof newQuoteSchema>;

function NewQuoteDialog({ onQuoteCreated }: { onQuoteCreated: () => void }) {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const form = useForm<NewQuoteForm>({
    resolver: zodResolver(newQuoteSchema),
  });

  const onSubmit = async (data: NewQuoteForm) => {
    if (!firestore) return;

    try {
      const fullBriefingDetails = {
        clientName: data.customerName,
        clientEmail: data.customerEmail,
        objective: data.serviceType,
        manualDetails: data.details,
      };

      const serviceRequestData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        serviceType: data.serviceType,
        details: JSON.stringify(fullBriefingDetails, null, 2),
        status: 'Pending',
        requestDate: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'service_requests'), serviceRequestData);

      toast({
        title: 'Solicitação Criada!',
        description: 'A nova solicitação de orçamento foi adicionada ao painel.',
      });
      form.reset();
      onQuoteCreated();
    } catch (error) {
      console.error("Error creating new quote:", error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível criar a solicitação. Tente novamente.',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" /> Novo Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Orçamento Avulso</DialogTitle>
          <DialogDescription>
            Insira os dados do cliente e os detalhes do projeto para criar uma nova solicitação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Cliente</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@doe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço/Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Site Institucional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes do Projeto</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cole aqui o briefing ou descreva as necessidades do cliente..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar e Adicionar ao Painel'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function IntranetPage() {
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    if(auth) {
        signOut(auth).then(() => {
            router.push('/');
        });
    }
  };

  // Show a loading state while checking for user
  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-12 px-6">
                 <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </main>
            <Footer />
        </div>
    )
  }

  // If user is authenticated, show the dashboard
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
            <div className="flex justify-between items-center mb-8 gap-4">
                 <h1 className="text-3xl font-bold">Painel de Solicitações</h1>
                 <div className="flex items-center gap-2">
                    <NewQuoteDialog onQuoteCreated={() => setIsDialogOpen(false)} />
                    <Button variant="outline" onClick={handleLogout}>Sair</Button>
                 </div>
            </div>
            <ServiceRequestDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
