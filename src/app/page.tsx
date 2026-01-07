import { getSortedPostsDataAsync } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { Sparkles, BookOpen, PenTool, Feather, ArrowRight } from 'lucide-react';

export default async function Home() {
  const allPosts = await getSortedPostsDataAsync();
  const recentPosts = allPosts.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative mb-20 py-20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(124,58,237,0.1),transparent_50%)]"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-purple-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-violet-400 rounded-full opacity-40 animate-purple-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-50 animate-purple-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-violet-300 rounded-full opacity-30 animate-purple-float" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="relative container text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main heading with animated text */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 dark:bg-purple-800/20 backdrop-blur-sm rounded-full border border-purple-400/30">
                <Sparkles className="w-4 h-4 text-purple-300 animate-purple-pulse" />
                <span className="text-purple-100 text-sm font-medium">Personal Blog</span>
                <Sparkles className="w-4 h-4 text-purple-300 animate-purple-pulse" style={{animationDelay: '1s'}} />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-100 via-violet-100 to-purple-200 bg-clip-text text-transparent">
                  Welcome to my
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-200 via-purple-100 to-violet-100 bg-clip-text text-transparent">
                  personal space
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              This is where I share my daily thoughts, reflections, and creative writing.
              You'll find journals documenting my journey, essays exploring ideas that matter,
              and poems capturing moments of beauty and introspection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/posts" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl shadow-purple-lg hover:shadow-purple-xl transform hover:-translate-y-1 transition-all duration-300">
                <span className="font-semibold">Explore All Posts</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/posts/journal" className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 dark:bg-purple-800/20 backdrop-blur-sm text-purple-100 rounded-xl border border-purple-400/50 hover:bg-white/20 dark:hover:bg-purple-700/30 hover:border-purple-300 transition-all duration-300">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Start with Journals</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900 bg-clip-text text-transparent">
              Latest Posts
            </span>
          </h2>
          <p className="text-purple-700 dark:text-purple-300 text-lg max-w-2xl mx-auto">
            Discover my most recent thoughts, stories, and creative expressions
          </p>
        </div>

        <div className="grid-cards">
          {recentPosts.map((post) => (
            <PostCard key={`${post.category}-${post.slug}`} post={post} />
          ))}
        </div>

        {/* View All Posts */}
        {allPosts.length > 6 && (
          <div className="mt-12 text-center">
            <Link href="/posts" className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg shadow-purple-md hover:shadow-purple-lg transform hover:-translate-y-0.5 transition-all duration-200">
              <span className="font-medium">View All Posts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </section>

      {/* Category Highlights */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Journals */}
          <div className="group relative p-8 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-purple-lg transition-all duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-purple-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">Journals</h3>
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              Daily thoughts, reflections, and personal insights from my journey.
            </p>
            <Link href="/posts/journal" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors">
              <span>Explore Journals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Essays */}
          <div className="group relative p-8 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl border border-violet-200/50 dark:border-violet-700/50 hover:shadow-violet-glow transition-all duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-violet-glow">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-100 mb-3">Essays</h3>
            <p className="text-violet-700 dark:text-violet-300 mb-4">
              In-depth explorations of ideas, concepts, and meaningful topics.
            </p>
            <Link href="/posts/essay" className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium transition-colors">
              <span>Read Essays</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Poems */}
          <div className="group relative p-8 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-800/30 dark:to-violet-800/30 rounded-2xl border border-purple-300/50 dark:border-purple-600/50 hover:shadow-purple-xl transition-all duration-300">
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center shadow-purple-lg">
              <Feather className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">Poems</h3>
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              Creative expressions capturing moments of beauty and introspection.
            </p>
            <Link href="/posts/poem" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors">
              <span>Discover Poems</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mb-20">
        <div className="relative p-8 md:p-12 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4 animate-purple-pulse" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Connected
            </h3>
            <p className="text-purple-100 text-lg mb-8">
              Get notified when I publish new posts and share fresh insights from my personal journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}