import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import Logo from '@/components/ui/Logo';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Register</h1>
        <RegisterForm />
        
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
