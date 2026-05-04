"use client";

import { Github, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const contactDetails = [
    { icon: '✉️', text: 'wrinformatica19@gmail.com', href: 'mailto:wrinformatica19@gmail.com' },
    { icon: '📱', text: '+55 31 97306-7627 (WhatsApp)', href: 'https://wa.me/5531973067627', target: '_blank' },
    { icon: '📍', text: 'Belo Horizonte, BR', description: '(Mudança imediata para PT)' },
];

const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin />, href: 'https://www.linkedin.com/in/ruan-andradesantana/' },
    { name: 'GitHub', icon: <Github />, href: 'https://github.com/Ruan-andrade' },
];

const formSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("Por favor, insira um email válido."),
    message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        const intro = `Olá, vim pelo seu site e gostaria de conversar.`;
        const contactInfo = `*Nome:* ${data.name}\n*Email:* ${data.email}`;
        const message = `*Mensagem:* ${data.message}`;

        const fullMessage = encodeURIComponent([intro, contactInfo, message].join('\n\n'));
        const whatsappUrl = `https://wa.me/5531973067627?text=${fullMessage}`;
        
        window.open(whatsappUrl, '_blank');
        form.reset();
    };


    return (
        <section id="contato" className="mx-auto mt-12 max-w-6xl border-t px-6 py-20">
            <div className="grid items-start gap-12 md:grid-cols-2">
                <div className="space-y-8">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold text-foreground">Vamos conversar?</h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Disponível para projetos freelancer, consultoria ou oportunidades fixas em Portugal. Preencha o formulário ou use um dos canais abaixo.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {contactDetails.map((detail, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary text-primary">
                                    {detail.icon}
                                </div>
                                <div>
                                    {detail.href ? (
                                        <a href={detail.href} target={detail.target} className="text-foreground transition hover:text-primary">
                                            {detail.text}
                                        </a>
                                    ) : (
                                        <span className="text-foreground">{detail.text}</span>
                                    )}
                                    {detail.description && (
                                        <span className="ml-2 text-xs text-muted-foreground">{detail.description}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="flex justify-start gap-4">
                        {socialLinks.map((link) => (
                            <Button key={link.name} asChild variant="secondary" className="flex-1 max-w-48 gap-2 font-bold dark:bg-black">
                                <a href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.icon}
                                    {link.name}
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>

                <Card className="bg-card shadow-lg glow-hover">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Envie uma Mensagem Direta</CardTitle>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="seu.melhor@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mensagem</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Como posso te ajudar?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex-col">
                                <Button type="submit" className="w-full">
                                    <MessageCircle className="mr-2" /> Enviar Mensagem via WhatsApp
                                </Button>
                                 <p className="text-xs text-muted-foreground text-center mt-4">Você será redirecionado para o WhatsApp para confirmar o envio.</p>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </section>
    );
}
