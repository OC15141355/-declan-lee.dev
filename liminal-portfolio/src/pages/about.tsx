import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Section from '../components/layout/Section';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
  max-width: 800px;
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

const AboutContent = styled.div`
  margin-top: 2rem;
  
  h2 {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
`;

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function About() {
  return (
    <Layout title="About | Liminal Portfolio" description="Learn more about me and my background">
      <Section id="about">
        <AboutContainer>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            <PageTitle>About Me</PageTitle>
            
            <AboutContent>
              <p>
                Welcome to my digital space. I'm a designer and developer passionate about creating intuitive, 
                engaging experiences that live at the intersection of creativity and technology.
              </p>
              
              <h2>My Journey</h2>
              <p>
                My path into design and development began with a curiosity about how things work and why they're 
                designed the way they are. This curiosity led me to explore the fields of user experience, 
                interface design, and eventually, front-end development.
              </p>
              <p>
                Over the years, I've had the opportunity to work on various projects, from designing user 
                interfaces for mobile applications to developing responsive websites for businesses. Each project 
                has been a learning experience, helping me refine my skills and approach.
              </p>
              
              <h2>My Approach</h2>
              <p>
                I believe in the power of thoughtful design and clean code. My process involves understanding 
                the user's needs, designing with intention, and implementing with precision. I strive to create 
                experiences that are not only visually appealing but also accessible and user-friendly.
              </p>
              <p>
                Whether I'm working on a personal project or collaborating with a team, my goal is to deliver 
                solutions that make a positive impact and exceed expectations.
              </p>
              
              <h2>Beyond Work</h2>
              <p>
                When I'm not designing or coding, you'll find me exploring new technologies, reading about design 
                trends, or enjoying a good book. I'm also passionate about photography and enjoy capturing 
                moments that tell a story.
              </p>
              <p>
                Thank you for visiting my portfolio. Feel free to explore my projects and get in touch if you'd 
                like to collaborate or just chat about design and technology.
              </p>
            </AboutContent>
          </motion.div>
        </AboutContainer>
      </Section>
    </Layout>
  );
}
