import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center container mx-auto px-4">
      <h1 className="text-white text-6xl font-bold mb-4">404</h1>
      <h2 className="text-gray-300 text-2xl mb-8">Page Not Found</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  )
}
