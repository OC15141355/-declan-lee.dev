import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

import Head from 'next/head';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/Layout';
import Section from '../../components/layout/Section';
import Button from '../../components/common/Button';
import MDXComponents from '../../components/mdx/MDXComponents';
import ShareButtons from '../../components/common/ShareButtons';
import { getProjectSlugs, getProjectBySlug, getAllProjects } from '../../utils/mdx';
import { Project, SerializedProject } from '../../types/Project';

interface ProjectPageProps {
  project: SerializedProject;
  otherProjects: Project[];
}

const ProjectContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProjectTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const Summary = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const TechStackContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const TechBadge = styled.span`
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  padding: 0.3rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.8rem;
`;

const ProjectImageContainer = styled.div`
  margin-bottom: 2.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ProjectContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2.5rem 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ShareSection = styled.div`
  margin: 2rem 0;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.bg.tertiary};
`;

const OtherProjects = styled.div`
  margin-top: 4rem;
`;

const OtherProjectsHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background: ${props => props.theme.bg.secondary};
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectCardImage = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  background-color: ${props => props.theme.bg.tertiary};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ProjectCardContent = styled.div`
  padding: 1.5rem;
`;

const ProjectCardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

export default function ProjectPage({ project, otherProjects }: ProjectPageProps) {
  const router = useRouter();
  
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <Section id="loading">
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h1>Loading...</h1>
          </div>
        </Section>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${project.title} | Projects`} description={project.summary}>
      <Head>
        <meta name="description" content={project.summary} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.summary} />
        {project.image && (
          <meta property="og:image" content={project.image} />
        )}
      </Head>
      
      <Section id="project">
        <ProjectContainer>
          <Button 
            variant="text" 
            size="sm" 
            onClick={() => router.back()}
            icon={<FaChevronLeft />}
            style={{ marginBottom: '2rem' }}
          >
            Back to Projects
          </Button>
          
          <ProjectHeader>
            <ProjectTitle>{project.title}</ProjectTitle>
            <Summary>{project.summary}</Summary>
            
            <TechStackContainer>
              {project.techStack.map(tech => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </TechStackContainer>
            
            {project.image && (
              <ProjectImageContainer>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1000}
                  height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </ProjectImageContainer>
            )}
          </ProjectHeader>
          
          <ProjectContent>
            <MDXRemote {...project.content} components={MDXComponents} />
          </ProjectContent>
          
          <ProjectLinks>
            {project.githubUrl && (
              <Button
                href={project.githubUrl}
                external
                icon={<FaGithub />}
              >
                View on GitHub
              </Button>
            )}
            
            {project.liveUrl && (
              <Button
                href={project.liveUrl}
                external
                variant={project.githubUrl ? 'outline' : 'primary'}
                icon={<FaExternalLinkAlt />}
              >
                Live Demo
              </Button>
            )}
          </ProjectLinks>
          
          <ShareSection>
            <h3 style={{ marginBottom: '1rem' }}>Share this project</h3>
            <ShareButtons url={`/projects/${project.slug}`} title={project.title} summary={project.summary} />
          </ShareSection>
          
          {otherProjects.length > 0 && (
            <OtherProjects>
              <OtherProjectsHeading>Other Projects</OtherProjectsHeading>
              
              <ProjectGrid>
                {otherProjects.map(otherProject => (
                  <Link href={`/projects/${otherProject.slug}`} key={otherProject.id} style={{ textDecoration: 'none' }}>
                    <ProjectCard>
                      {otherProject.image && (
                        <ProjectCardImage style={{ backgroundImage: `url(${otherProject.image})` }} />
                      )}
                      
                      <ProjectCardContent>
                        <ProjectCardTitle>{otherProject.title}</ProjectCardTitle>
                        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>
                          {otherProject.techStack.slice(0, 3).join(', ')}
                          {otherProject.techStack.length > 3 && '...'}
                        </p>
                      </ProjectCardContent>
                    </ProjectCard>
                  </Link>
                ))}
              </ProjectGrid>
            </OtherProjects>
          )}
        </ProjectContainer>
      </Section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getProjectSlugs();
  
  return {
    paths: slugs.map(slug => ({ params: { slug: slug.replace(/\.mdx$/, '') } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const project = await getProjectBySlug(slug);
    
    // Get other projects (excluding the current one)
    const allProjects = await getAllProjects();
    const otherProjects = allProjects
      .filter(p => p.id !== project.id)
      .slice(0, 3);
    
    return {
      props: {
        project,
        otherProjects,
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error in getStaticProps for project:", error);
    return {
      notFound: true,
    };
  }
};
