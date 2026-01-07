"use client";
import { useEffect, useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

function setHtmlTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const cookieTheme = document.cookie.match(/(?:^|; )theme=(dark|light)/)?.[1] as 'light' | 'dark' | undefined;
    const stored = (localStorage.getItem('theme') as 'light' | 'dark' | null) || undefined;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return cookieTheme || stored || system;
  });

  useEffect(() => {
    setHtmlTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `theme=${theme}; path=/; max-age=${oneYear}`;
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className="relative group p-3 rounded-full bg-white/10 dark:bg-purple-800/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-purple-md"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-6 h-6">
          {/* Sun icon for light mode */}
          <div className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
            <Sun className="w-6 h-6 text-purple-600 drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-purple-pulse"></div>
          </div>
          
          {/* Moon icon for dark mode */}
          <div className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
            <Moon className="w-6 h-6 text-purple-300 drop-shadow-lg" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-purple-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Sparkle effects */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-purple-float" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="w-3 h-3 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-purple-float" style={{animationDelay: '1s'}} />
        </div>
      </div>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-violet-400/20 scale-0 group-active:scale-100 transition-transform duration-300"></span>
    </button>
  );
}