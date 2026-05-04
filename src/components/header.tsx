"use client";

import { ThemeToggle } from "./theme-toggle";
import { useUser } from "@/firebase";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/#projetos", label: "./projetos" },
  { href: "/#servicos", label: "./serviços" },
  { href: "/#contato", label: "./contato" },
  { href: "/briefing", label: "Orçamento" },
];

export function Header() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/90 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="font-code text-xl font-bold text-primary">
          &lt; RS Sistemas/ &gt;
        </a>

        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden md:flex md:gap-6 text-sm font-bold">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition hover:text-primary"
              >
                {link.label}
              </a>
            ))}
             {user && (
              <a href="/intranet" className="text-foreground/80 transition hover:text-primary">
                Intranet
              </a>
            )}
          </nav>
          <ThemeToggle />
          {!user && (
             <Button asChild variant="outline" size="sm">
                <a href="/login">Login</a>
             </Button>
          )}
        </div>
      </div>
    </header>
  );
}
