import Link from 'next/link';
import { Sparkles, BookOpen, PenTool, Feather, Hash, Github, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 border-t border-purple-500/30 mt-20">
      {/* Decorative wave */}
      <div className="relative">
        <svg className="w-full h-12 text-purple-800/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-sm opacity-75"></div>
                <Sparkles className="relative w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-100 to-violet-100 bg-clip-text text-transparent">
                Personal Blog
              </h3>
            </div>
            <p className="text-purple-200 mb-6 max-w-md">
              A personal space for thoughts, reflections, and creative expressions. 
              Discover journals, essays, and poems crafted with passion and purpose.
            </p>
            <div className="flex items-center gap-2 text-purple-300">
              <Heart className="w-4 h-4 animate-purple-pulse" />
              <span className="text-sm">Made with love and purple magic</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></div>
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/posts/journal" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                  <BookOpen className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  <span>Journals</span>
                </Link>
              </li>
              <li>
                <Link href="/posts/essay" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                  <PenTool className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  <span>Essays</span>
                </Link>
              </li>
              <li>
                <Link href="/posts/poem" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                  <Feather className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  <span>Poems</span>
                </Link>
              </li>
              <li>
                <Link href="/tags" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                  <Hash className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  <span>Tags</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></div>
              Connect
            </h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                <Github className="w-4 h-4 text-purple-300 group-hover:text-white" />
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                <Twitter className="w-4 h-4 text-purple-300 group-hover:text-white" />
                <span>Twitter</span>
              </a>
              <a href="mailto:hello@example.com" className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-purple-300 group-hover:text-white" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-purple-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-purple-200 text-sm">
              © {new Date().getFullYear()} Personal Blog. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-purple-300">
              <span>Built with Next.js</span>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>Styled with Tailwind CSS</span>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>Powered by Purple Magic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating purple particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-purple-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-violet-400 rounded-full opacity-40 animate-purple-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-50 animate-purple-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-violet-300 rounded-full opacity-30 animate-purple-float" style={{animationDelay: '0.5s'}}></div>
      </div>
    </footer>
  );
}