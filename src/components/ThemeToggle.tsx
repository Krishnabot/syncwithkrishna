"use client";
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

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
      className="btn-icon"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <span suppressHydrationWarning>
        {theme === 'dark' ? <Sun className="icon" /> : <Moon className="icon" />}
      </span>
    </button>
  );
}
