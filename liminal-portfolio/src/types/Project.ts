export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  date: string;
}
