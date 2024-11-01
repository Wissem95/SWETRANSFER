import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
      ☁️ Cloud Storage
    </Link>
  )
}
