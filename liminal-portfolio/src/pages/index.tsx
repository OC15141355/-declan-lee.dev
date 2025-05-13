import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import { getAllProjects } from '../utils/mdx';
import { Project } from '../types/Project';
import { motion } from 'framer-motion';

interface HomePageProps {
  projects: Project[];
}

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Hero = styled.section`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled(motion.h2)`
  color: ${props => props.theme.text.secondary};
  font-size: clamp(1rem, 4vw, 1.5rem);
  font-weight: 400;
  margin-bottom: 2rem;
`;

const About = styled(motion.p)`
  max-width: 600px;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ProjectsSection = styled.section`
  padding: 4rem 0;
`;

const SectionTitle = styled.h2`
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

export default function Home({ projects }: HomePageProps) {
  const featuredProjects = projects.filter(project => project.featured);
  
  return (
    <Layout title="Liminal Portfolio - Home" description="A modern, minimalist developer portfolio with blog capabilities.">
      <HomeContainer>
        <Hero>
          <HeroTitle
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Liminal <span style={{ color: '#64FFDA' }}>Portfolio</span>
          </HeroTitle>
          <HeroSubtitle
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Developer • Designer • Writer
          </HeroSubtitle>
          <About
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            I&apos;m a fullstack developer with a passion for building clean, efficient, and user-friendly web applications. 
            With over 5 years of experience in web development, I specialize in React, TypeScript, and Node.js.
          </About>
        </Hero>
        
        <ProjectsSection>
          <SectionTitle>Featured Projects</SectionTitle>
          <ProjectGrid>
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id}
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
            ))}
          </ProjectGrid>
        </ProjectsSection>
      </HomeContainer>
    </Layout>
  );
}

export async function getStaticProps() {
  const projects = getAllProjects();
  
  return {
    props: {
      projects,
    },
  };
}
