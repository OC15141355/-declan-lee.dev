import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string | null;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  date: string;
}

export interface SerializedProject extends Omit<Project, 'content'> {
  content: MDXRemoteSerializeResult;
  rawContent: string;
}
