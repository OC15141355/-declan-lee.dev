import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 0 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.accent.primary};
`;

const Message = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.text.secondary};
  max-width: 500px;
`;

const HomeLink = styled(motion.a)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.accent.primary};
  color: ${props => props.theme.bg.primary};
  border-radius: ${props => props.theme.radii.sm};
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.accent.secondary};
    transform: translateY(-2px);
  }
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

export default function Custom404() {
  return (
    <Layout title="404 - Page Not Found" description="The page you are looking for couldn't be found.">
      <NotFoundContainer>
        <Title
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          404
        </Title>
        <Message
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Message>
        <Link href="/" passHref legacyBehavior>
          <HomeLink
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </HomeLink>
        </Link>
      </NotFoundContainer>
    </Layout>
  );
}
