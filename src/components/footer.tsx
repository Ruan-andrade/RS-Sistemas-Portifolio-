export function Footer() {
    return (
        <footer className="border-t bg-card py-8 text-center text-sm text-muted-foreground transition-colors">
            <p>Desenvolvido por RS Sistemas © 2026</p>
            <div className="mt-2">
                <a href="/documentation" className="hover:text-primary hover:underline">
                    Ver Documentação do Projeto
                </a>
            </div>
        </footer>
    );
}
