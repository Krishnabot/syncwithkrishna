import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: 'journal' | 'essay' | 'poem';
  tags: string[];
  excerpt: string;
  content: string;
  draft?: boolean;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getSortedPostsData(): Post[] {
  // Get all categories
  const categories = ['journals', 'essays', 'poems'];
  const allPosts: Post[] = [];

  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    
    if (fs.existsSync(categoryPath)) {
      const fileNames = fs.readdirSync(categoryPath);
      
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(categoryPath, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents);
          
          const post: Post = {
            slug,
            title: matterResult.data.title,
            date: matterResult.data.date,
            category: category.slice(0, -1) as 'journal' | 'essay' | 'poem', // Remove 's' from category
            tags: matterResult.data.tags || [],
            excerpt: matterResult.data.excerpt,
            content: matterResult.content,
            draft: !!matterResult.data.draft,
          };

          if (!post.draft) allPosts.push(post);
        }
      });
    }
  });

  // Sort posts by date
  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getSortedPostsDataIncludeDrafts(): Post[] {
  const categories = ['journals', 'essays', 'poems'];
  const allPosts: Post[] = [];
  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    if (fs.existsSync(categoryPath)) {
      const fileNames = fs.readdirSync(categoryPath);
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(categoryPath, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);
          const post: Post = {
            slug,
            title: matterResult.data.title,
            date: matterResult.data.date,
            category: category.slice(0, -1) as 'journal' | 'essay' | 'poem',
            tags: matterResult.data.tags || [],
            excerpt: matterResult.data.excerpt,
            content: matterResult.content,
            draft: !!matterResult.data.draft,
          };
          allPosts.push(post);
        }
      });
    }
  });
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: 'journal' | 'essay' | 'poem'): Post[] {
  return getSortedPostsData().filter((p) => p.category === category);
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getSortedPostsData()) {
    for (const tag of p.tags || []) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  const t = tag.toLowerCase();
  return getSortedPostsData().filter((p) => (p.tags || []).some((x) => x.toLowerCase() === t));
}

export function paginate<T>(items: T[], page: number, pageSize: number): { totalPages: number; slice: T[] } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (Math.max(1, page) - 1) * pageSize;
  return { totalPages, slice: items.slice(start, start + pageSize) };
}

export function sortPosts(posts: Post[], order: 'asc' | 'desc' = 'desc'): Post[] {
  const arr = [...posts];
  arr.sort((a, b) => (order === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  return arr;
}

export function getAllPostSlugs(): { category: string; slug: string }[] {
  const categories = ['journals', 'essays', 'poems'];
  const slugs: { category: string; slug: string }[] = [];

  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    
    if (fs.existsSync(categoryPath)) {
      const fileNames = fs.readdirSync(categoryPath);
      
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const slug = fileName.replace(/\.md$/, '');
          slugs.push({
            category: category.slice(0, -1), // Remove 's' from category
            slug,
          });
        }
      });
    }
  });

  return slugs;
}

export async function getPostData(category: string, slug: string): Promise<Post> {
  // Map category to directory name
  const categoryMap: { [key: string]: string } = {
    'journal': 'journals',
    'essay': 'essays',
    'poem': 'poems'
  };
  
  const categoryDir = categoryMap[category] || category + 's';
  const fullPath = path.join(postsDirectory, categoryDir, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${fullPath}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Keep raw MDX content; render in page using next-mdx-remote

  const post: Post = {
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: category as 'journal' | 'essay' | 'poem',
    tags: matterResult.data.tags || [],
    excerpt: matterResult.data.excerpt,
    content: matterResult.content,
    draft: !!matterResult.data.draft,
  };

  return post;
}

export function getDraftPosts(): Post[] {
  return getSortedPostsDataIncludeDrafts().filter(p => p.draft);
}
