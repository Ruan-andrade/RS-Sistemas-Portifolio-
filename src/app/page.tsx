import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Stats } from '@/components/stats';
import { Projects } from '@/components/projects';
import { Services } from '@/components/services';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Stats />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
