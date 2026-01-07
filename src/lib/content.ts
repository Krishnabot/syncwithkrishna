import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: 'journal' | 'essay' | 'poem';
  tags: string[];
  excerpt: string;
  content: string;
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
          };
          
          allPosts.push(post);
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

export function getAllPostSlugs() {
  const categories = ['journals', 'essays', 'poems'];
  const slugs: { params: { category: string; slug: string } }[] = [];

  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    
    if (fs.existsSync(categoryPath)) {
      const fileNames = fs.readdirSync(categoryPath);
      
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const slug = fileName.replace(/\.md$/, '');
          slugs.push({
            params: {
              category: category.slice(0, -1), // Remove 's' from category
              slug,
            },
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

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const post: Post = {
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: category as 'journal' | 'essay' | 'poem',
    tags: matterResult.data.tags || [],
    excerpt: matterResult.data.excerpt,
    content: contentHtml,
  };

  return post;
}