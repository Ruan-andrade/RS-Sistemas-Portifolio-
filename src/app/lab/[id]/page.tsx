import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LabView } from '@/components/lab-view';

export default function LabPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <LabView serviceRequestId={params.id} />
      </main>
      <Footer />
    </div>
  );
}
