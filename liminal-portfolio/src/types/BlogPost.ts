import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category?: string;
  readingTime?: string;
  image?: string | null;
}

export interface SerializedBlogPost extends Omit<BlogPost, 'content'> {
  content: MDXRemoteSerializeResult;
  rawContent: string;
}
