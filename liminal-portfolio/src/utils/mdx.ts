import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost } from '../types/BlogPost';
import { Project } from '../types/Project';

const blogDirectory = path.join(process.cwd(), 'src/content/blog');
const projectDirectory = path.join(process.cwd(), 'src/content/projects');

export function getBlogSlugs() {
  return fs.readdirSync(blogDirectory);
}

export function getProjectSlugs() {
  return fs.readdirSync(projectDirectory);
}

export function getBlogPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const readingTimeResult = readingTime(content);
  
  const blogPost: BlogPost = {
    id: data.id || realSlug,
    slug: realSlug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    content,
    tags: data.tags || [],
    category: data.category,
    readingTime: readingTimeResult.text,
  };

  return blogPost;
}

export function getProjectBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(projectDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const project: Project = {
    id: data.id || realSlug,
    slug: realSlug,
    title: data.title,
    summary: data.summary,
    content,
    image: data.image,
    techStack: data.techStack || [],
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    featured: data.featured,
    date: data.date,
  };

  return project;
}

export function getAllBlogPosts() {
  const slugs = getBlogSlugs();
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .sort((post1, post2) => (new Date(post2.date) > new Date(post1.date) ? 1 : -1));
  
  return posts;
}

export function getAllProjects() {
  const slugs = getProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .sort((project1, project2) => (project2.featured ? 1 : -1));
  
  return projects;
}
