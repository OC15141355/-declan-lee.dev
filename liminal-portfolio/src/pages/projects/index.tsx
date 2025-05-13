import React from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import Section from '../../components/layout/Section';
import { getAllProjects } from '../../utils/mdx';
import { Project } from '../../types/Project';

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ProjectSummary = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex: 1;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const ProjectTag = styled.span`
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.full};
`;

const NoProjects = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.text.secondary};
`;

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function Projects({ projects }: ProjectsPageProps) {
  return (
    <Layout title="Projects | Liminal Portfolio" description="Explore my featured projects and work">
      <Section id="projects">
        <ProjectsContainer>
          <PageTitle>Projects</PageTitle>
          
          {projects.length > 0 ? (
            <ProjectGrid>
              {projects.map((project, index) => (
                <Link href={`/projects/${project.slug}`} key={project.id} style={{ textDecoration: 'none' }}>
                  <ProjectCard
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    {project.image && (
                      <ProjectImage style={{ backgroundImage: `url(${project.image})` }} />
                    )}
                    
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
          ) : (
            <NoProjects>
              <h2>No projects found</h2>
              <p>Check back soon for updates!</p>
            </NoProjects>
          )}
        </ProjectsContainer>
      </Section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getAllProjects();
  
  return {
    props: {
      projects,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
};
