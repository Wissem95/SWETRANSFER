import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="mb-12">
        <Logo />
      </div>

      <h1 className="text-4xl font-bold mb-8">
        Welcome to Cloud Storage
      </h1>
      
      <div className="flex gap-4">
        <Link 
          href="/auth/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Login
        </Link>
        
        <Link 
          href="/auth/register"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Register
        </Link>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2">
          <li>✨ Secure file storage</li>
          <li>📁 Easy file management</li>
          <li>🔒 Private and secure</li>
          <li>💫 Simple to use</li>
        </ul>
      </div>
    </main>
  )
}
