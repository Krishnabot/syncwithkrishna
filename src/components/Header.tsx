"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Sparkles, BookOpen, PenTool, Feather, Hash } from 'lucide-react';

const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-violet-900/90 backdrop-blur-lg border-b border-purple-500/20 shadow-purple-lg">
      <div className="container flex items-center justify-between py-4">
        {/* Logo with purple gradient */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="relative w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="relative">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-100 to-violet-100 bg-clip-text text-transparent">
              Personal Blog
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </Link>

        {/* Navigation with purple accents */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-medium">Home</span>
            </Link>
            
            <Link href="/posts/journal" className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-200">
              <BookOpen className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Journals</span>
            </Link>
            
            <Link href="/posts/essay" className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-200">
              <PenTool className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Essays</span>
            </Link>
            
            <Link href="/posts/poem" className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-200">
              <Feather className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Poems</span>
            </Link>
            
            <Link href="/tags" className="group flex items-center gap-2 text-purple-100 hover:text-white transition-all duration-200">
              <Hash className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
              <span className="font-medium">Tags</span>
            </Link>
          </nav>

          {/* Theme Toggle with purple styling */}
          <div className="flex items-center gap-4">
            <div className="w-px h-6 bg-gradient-to-b from-purple-400 to-violet-400 opacity-50"></div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Animated purple gradient border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
    </header>
  );
}