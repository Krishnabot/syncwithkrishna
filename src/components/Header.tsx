"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="header">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="site-title">
          Personal Blog
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-6">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/posts/journal" className="nav-link">Journals</Link>
            <Link href="/posts/essay" className="nav-link">Essays</Link>
            <Link href="/posts/poem" className="nav-link">Poems</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
