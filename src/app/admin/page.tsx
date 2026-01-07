import { requireAdmin } from '@/lib/auth';
import { dbGetPosts } from '@/lib/sqlite';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import SeedButton from '@/components/admin/SeedButton';
import type { Post } from '@/lib/content';
import { Sparkles, Plus, LogOut, Edit, BookOpen, PenTool, Feather } from 'lucide-react';

const categoryIcons = {
  journal: BookOpen,
  essay: PenTool,
  poem: Feather,
};

export default async function AdminPage() {
  const email = await requireAdmin();
  if (!email) redirect('/admin/login');
  const rows = await dbGetPosts();
  const posts: Post[] = rows.map((p) => ({ ...p, category: p.category as Post['category'], tags: p.tags as string[] }));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:via-violet-950 dark:to-purple-900">
      {/* Header */}
      <div className="relative mb-8 p-6 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-2xl shadow-purple-lg overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-sm opacity-75"></div>
              <Sparkles className="relative w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-100">Welcome back, {email}</p>
            </div>
          </div>
          
          <form action="/api/admin/logout" method="post">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-200" type="submit">
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Posts</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{posts.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-2xl border border-violet-200/50 dark:border-violet-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-violet-900 dark:text-violet-100">{posts.filter(p => !p.draft).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-purple-200 to-violet-200 dark:from-purple-800/50 dark:to-violet-800/50 rounded-2xl border border-purple-300/50 dark:border-purple-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{posts.filter(p => p.draft).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Feather className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/admin/new" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl shadow-purple-md hover:shadow-purple-lg transform hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Post</span>
        </Link>
        <SeedButton />
        <Link href="/admin/security" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-800 transition-all duration-200">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Security Settings</span>
        </Link>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">All Posts</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">No posts yet</h3>
            <p className="text-purple-600 dark:text-purple-400 mb-4">Start creating your first post to see it here.</p>
            <Link href="/admin/new" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg">
              <Plus className="w-4 h-4" />
              <span>Create First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post: Post) => {
              const Icon = categoryIcons[post.category];
              return (
                <div key={post.slug} className="group relative p-6 bg-white dark:bg-purple-900/30 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-purple-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400 mt-1">
                          <span className="capitalize font-medium">{post.category}</span>
                          <span>•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                          {post.draft && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                                Draft
                              </span>
                            </>
                          )}
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/edit/${post.slug}`} 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <DeleteButton slug={post.slug} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}