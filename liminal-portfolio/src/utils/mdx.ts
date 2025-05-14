import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import { BlogPost, SerializedBlogPost } from '../types/BlogPost';
import { Project, SerializedProject } from '../types/Project';

// Directories
const blogDirectory = path.join(process.cwd(), 'src/content/blog');
const projectDirectory = path.join(process.cwd(), 'src/content/projects');

// Type for front matter
interface FrontMatter {
  id?: string;
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  image?: string | null;
  techStack?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  readingTime?: string;
  [key: string]: string | string[] | boolean | null | undefined;
}

// Get all file paths for a directory
const getFilePaths = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((path) => /\.mdx?$/.test(path));
};

// Parse MDX file content
export const parseMDXFile = async (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const readTime = readingTime(content);
  
  // Cast data to FrontMatter type
  // Convert dates to ISO strings for serialization
  const frontMatter: FrontMatter = {
    ...data,
    date: data.date ? new Date(data.date).toISOString() : '',
    readingTime: readTime.text,
  };
  
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypePrism, { ignoreMissing: true }],
      ],
    },
    scope: frontMatter,
  });
  
  return {
    frontMatter,
    content: mdxSource,
    rawContent: content,
  };
};

// Blog Post Functions
export const getBlogSlugs = () => {
  return getFilePaths(blogDirectory).map((path) => path.replace(/\.mdx?$/, ''));
};

export const getBlogPostBySlug = async (slug: string): Promise<SerializedBlogPost> => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Blog post with slug "${slug}" not found.`);
  }
  
  const { frontMatter, content, rawContent } = await parseMDXFile(fullPath);
  
  const post: SerializedBlogPost = {
    id: frontMatter.id || realSlug,
    slug: realSlug,
    title: frontMatter.title || '',
    date: frontMatter.date || '',
    summary: frontMatter.summary || '',
    tags: frontMatter.tags || [],
    category: frontMatter.category,
    readingTime: frontMatter.readingTime,
    image: frontMatter.image || null,
    content,
    rawContent,
  };
  
  return post;
};

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const slugs = getBlogSlugs();
  const postsPromises = slugs.map(async (slug) => {
    try {
      const post = await getBlogPostBySlug(slug);
      // Convert to regular BlogPost (without MDX content) for listing pages
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, rawContent, ...postWithoutContent } = post;
      return {
        ...postWithoutContent,
        content: '', // Use empty string for content in listing pages
      };
    } catch (error) {
      console.error(`Error processing blog post ${slug}:`, error);
      return null;
    }
  });

  const posts = (await Promise.all(postsPromises)).filter(Boolean) as BlogPost[];
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Project Functions
export const getProjectSlugs = () => {
  return getFilePaths(projectDirectory).map((path) => path.replace(/\.mdx?$/, ''));
};

export const getProjectBySlug = async (slug: string): Promise<SerializedProject> => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(projectDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Project with slug "${slug}" not found.`);
  }
  
  const { frontMatter, content, rawContent } = await parseMDXFile(fullPath);
  
  const project: SerializedProject = {
    id: frontMatter.id || realSlug,
    slug: realSlug,
    title: frontMatter.title || '',
    summary: frontMatter.summary || '',
    date: frontMatter.date || '',
    techStack: frontMatter.techStack || [],
    image: frontMatter.image || null,
    githubUrl: frontMatter.githubUrl || null,
    liveUrl: frontMatter.liveUrl || null,
    featured: frontMatter.featured || false,
    content,
    rawContent,
  };
  
  return project;
};

export const getAllProjects = async (): Promise<Project[]> => {
  const slugs = getProjectSlugs();
  const projectsPromises = slugs.map(async (slug) => {
    try {
      const project = await getProjectBySlug(slug);
      // Convert to regular Project (without MDX content) for listing pages
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, rawContent, ...projectWithoutContent } = project;
      return {
        ...projectWithoutContent,
        content: '', // Use empty string for content in listing pages
      };
    } catch (error) {
      console.error(`Error processing project ${slug}:`, error);
      return null;
    }
  });

  const projects = (await Promise.all(projectsPromises)).filter(Boolean) as Project[];
  
  // Sort projects by featured and then by date
  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Tag and Category Functions
export const getAllTags = async () => {
  const posts = await getAllBlogPosts();
  const tagCounts: { [key: string]: number } = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Convert to array of tag objects with counts
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getAllCategories = async () => {
  const posts = await getAllBlogPosts();
  const categoryCounts: { [key: string]: number } = {};
  
  posts.forEach(post => {
    if (post.category) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }
  });
  
  // Convert to array of category objects with counts
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

// Table of Contents Generator
export const generateTableOfContents = (content: string) => {
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ id, text, level });
  }
  
  return headings;
};

// Get related posts
export const getRelatedPosts = async (currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> => {
  const allPosts = await getAllBlogPosts();
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  // Score each post based on shared tags and categories
  interface ScoredPost extends BlogPost {
    score: number;
  }
  
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Score for matching tags
    currentPost.tags.forEach(tag => {
      if (post.tags.includes(tag)) score += 2;
    });
    
    // Score for matching category
    if (post.category === currentPost.category) score += 3;
    
    return { ...post, score };
  }) as ScoredPost[];
  
  // Sort by score (highest first) and date (newest first) as tiebreaker
  return scoredPosts
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
};
