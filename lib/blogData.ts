export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

// Database interface (matches Supabase schema)
export interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Convert DB format to app format
export function convertBlogPost(dbPost: BlogPostDB): BlogPost {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    author: dbPost.author,
    publishedAt: dbPost.published_at,
    image: dbPost.image,
    category: dbPost.category,
    tags: dbPost.tags || [],
    readTime: dbPost.read_time,
    featured: dbPost.featured,
  };
}

// Server-side functions (for use in server components)
import { supabase } from "./supabase";

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return undefined;
    return convertBlogPost(data as BlogPostDB);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return undefined;
  }
}

export async function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.tag) {
      query = query.contains("tags", [filters.tag]);
    }

    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data.map((post) => convertBlogPost(post as BlogPostDB));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    return Array.from(new Set(posts.map((post) => post.category)));
  } catch (error) {
    return [];
  }
}

export async function getBlogTags(): Promise<string[]> {
  try {
    const posts = await getBlogPosts();
    return Array.from(new Set(posts.flatMap((post) => post.tags)));
  } catch (error) {
    return [];
  }
}
