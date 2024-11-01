import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
        
        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
