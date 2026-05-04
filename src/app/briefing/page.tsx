import { BriefingForm } from '@/components/briefing-form';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function BriefingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <BriefingForm />
      </main>
      <Footer />
    </div>
  );
}
