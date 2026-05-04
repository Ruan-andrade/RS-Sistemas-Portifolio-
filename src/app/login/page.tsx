import { LoginForm } from '@/components/login-form';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
