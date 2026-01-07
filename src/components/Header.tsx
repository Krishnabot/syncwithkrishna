import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Personal Blog
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/posts/journal" className="text-gray-700 hover:text-blue-600">Journals</Link>
          <Link href="/posts/essay" className="text-gray-700 hover:text-blue-600">Essays</Link>
          <Link href="/posts/poem" className="text-gray-700 hover:text-blue-600">Poems</Link>
        </nav>
      </div>
    </header>
  );
}

