import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { getAllProjects, getAllBlogPosts } from '../utils/mdx';
import { Project } from '../types/Project';
import { BlogPost } from '../types/BlogPost';
import Section from '../components/layout/Section';
import HeroSection from '../components/sections/HeroSection';

interface HomePageProps {
  projects: Project[];
  blogPosts: BlogPost[];
}

const HomeContainer = styled.div`
  width: 100%;
`;

const SectionHeading = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60%;
    height: 3px;
    background-color: ${props => props.theme.accent.primary};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectImage = styled.div`
  height: 180px;
  background-color: ${props => props.theme.bg.tertiary};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ProjectSummary = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;


const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BlogCard = styled(motion.div)`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const BlogSummary = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const BlogTag = styled.span`
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.full};
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProjectTag = styled.span`
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.full};
`;

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function Home({ projects, blogPosts }: HomePageProps) {
  const featuredProjects = projects.filter(project => project.featured);
  // Get the 3 most recent blog posts
  const recentBlogPosts = blogPosts.slice(0, 3);
  
  return (
    <Layout title="Liminal Portfolio - Home" description="A modern, minimalist developer portfolio with blog capabilities.">
      <HomeContainer>
        <HeroSection />
        
        <Section id="projects">
          <SectionHeading>Featured Projects</SectionHeading>
          <ProjectGrid>
            {featuredProjects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} key={project.id} style={{ textDecoration: 'none' }}>
                <ProjectCard 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index + 3}
                >
                  <ProjectImage style={{ backgroundImage: project.image ? `url(${project.image})` : 'none' }} />
                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectSummary>{project.summary}</ProjectSummary>
                    <ProjectTags>
                      {project.techStack.slice(0, 3).map(tech => (
                        <ProjectTag key={tech}>{tech}</ProjectTag>
                      ))}
                      {project.techStack.length > 3 && (
                        <ProjectTag>+{project.techStack.length - 3}</ProjectTag>
                      )}
                    </ProjectTags>
                  </ProjectContent>
                </ProjectCard>
              </Link>
            ))}
          </ProjectGrid>
        </Section>

        <Section id="blog">
          <SectionHeading>Latest Blog Posts</SectionHeading>
          <BlogGrid>
            {recentBlogPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none' }}>
                <BlogCard 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index + featuredProjects.length + 3}
                >
                  <BlogContent>
                    <BlogTitle>{post.title}</BlogTitle>
                    <BlogSummary>{post.summary}</BlogSummary>
                    <BlogMeta>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      {post.readingTime && <span>{post.readingTime}</span>}
                    </BlogMeta>
                    <BlogTags>
                      {post.tags.slice(0, 3).map(tag => (
                        <BlogTag key={tag}>{tag}</BlogTag>
                      ))}
                      {post.tags.length > 3 && (
                        <BlogTag>+{post.tags.length - 3}</BlogTag>
                      )}
                    </BlogTags>
                  </BlogContent>
                </BlogCard>
              </Link>
            ))}
          </BlogGrid>
        </Section>
      </HomeContainer>
    </Layout>
  );
}

export async function getStaticProps() {
  const projects = await getAllProjects();
  const blogPosts = await getAllBlogPosts();
  
  return {
    props: {
      projects,
      blogPosts,
    },
  };
}
