import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AnimatedText from '../common/AnimatedText';
import Button from '../common/Button';
import { FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { useScroll } from '../../context/ScrollContext';

const HeroContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 1;
`;

const Greeting = styled(motion.p)`
  font-size: 1.25rem;
  color: ${props => props.theme.accent.primary};
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    font-size: 1rem;
  }
`;

const Name = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
`;

const Title = styled.h2`
  font-size: clamp(1.25rem, 4vw, 2rem);
  color: ${props => props.theme.text.secondary};
  margin-bottom: 2rem;
  font-weight: 400;
`;

const Description = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints?.sm || '576px'}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled(motion.a)`
  color: ${props => props.theme.text.secondary};
  font-size: 1.5rem;
  
  &:hover {
    color: ${props => props.theme.accent.primary};
  }
`;

// Background elements
const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  opacity: 0.2;
`;

const FloatingSquare = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid ${props => props.theme.accent.primary};
  opacity: 0.2;
`;

const FloatingCircle = styled(motion.div)`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.accent.secondary || props.theme.accent.primary};
  opacity: 0.15;
`;

const ScrollDownIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.text.secondary};
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ScrollArrow = styled(motion.div)`
  width: 24px;
  height: 24px;
  border-left: 2px solid ${props => props.theme.text.secondary};
  border-bottom: 2px solid ${props => props.theme.text.secondary};
  transform: rotate(-45deg);
`;

export const HeroSection = () => {
  const { scrollToSection } = useScroll();
  
  const handleScrollDown = () => {
    scrollToSection('projects');
  };
  
  return (
    <HeroContainer id="hero">
      <BackgroundElements>
        <FloatingSquare
          initial={{ x: '10%', y: '20%', rotate: 0 }}
          animate={{ x: '12%', y: '18%', rotate: 45 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 10 }}
        />
        <FloatingCircle
          initial={{ x: '80%', y: '60%', scale: 1 }}
          animate={{ x: '78%', y: '62%', scale: 1.1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 12 }}
        />
        <FloatingSquare
          initial={{ x: '70%', y: '30%', rotate: 20, scale: 1.5 }}
          animate={{ x: '72%', y: '28%', rotate: 65, scale: 1.4 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 8 }}
        />
      </BackgroundElements>
      
      <HeroContent>
        <Greeting
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to my personal space, I&apos;m
        </Greeting>
        
        <Name>
          <AnimatedText
            text="Declan WAKEFIELD"
            element="span"
            animation="words"
            staggerChildren={0.1}
            delayChildren={0.5}
          />
        </Name>
        
        <Title>
          <AnimatedText
            text="MLops Engineer • Fullstack Developer"
            element="span"
            animation="words"
            staggerChildren={0.05}
            delayChildren={0.8}
          />
        </Title>
        
        <Description>
          I&apos;m a fullstack developer with a passion for building clean, efficient, and user-friendly web applications. 
          With over 5 years of experience in web development, I specialize in React, TypeScript, and Node.js.
        </Description>
        
        <ButtonGroup>
          <Button 
            onClick={() => scrollToSection('projects')}
            icon={<span>👀</span>}
          >
            View My Work
          </Button>
          <Button 
            variant="outline" 
            onClick={() => scrollToSection('contact')}
          >
            Get In Touch
          </Button>
        </ButtonGroup>
        
        <SocialLinks>
          <SocialLink
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub />
          </SocialLink>
          <SocialLink
            href="https://linkedin.com/in/username"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaLinkedinIn />
          </SocialLink>
          <SocialLink
            href="https://twitter.com/username"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTwitter />
          </SocialLink>
        </SocialLinks>
      </HeroContent>
      
      <ScrollDownIndicator
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <ScrollText>Scroll Down</ScrollText>
        <ScrollArrow
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </ScrollDownIndicator>
    </HeroContainer>
  );
};

export default HeroSection;
