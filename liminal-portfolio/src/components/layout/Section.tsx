import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, MotionProps } from 'framer-motion';
import { useScroll } from '../../context/ScrollContext';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: React.ReactNode;
  fullHeight?: boolean;
  backgroundColor?: string;
  color?: string;
  center?: boolean;
  narrow?: boolean;
  animation?: 'fade' | 'slide' | 'none';
}

// Define animation variants
const sectionVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  },
  slide: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

const SectionContainer = styled(motion.section)<{
  $fullHeight?: boolean;
  $backgroundColor?: string;
  $color?: string;
  $center?: boolean;
  $narrow?: boolean;
}>`
  position: relative;
  min-height: ${props => props.$fullHeight ? '100vh' : 'auto'};
  background-color: ${props => props.$backgroundColor || 'transparent'};
  color: ${props => props.$color || props.theme.text.primary};
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  ${props => props.$center && `
    justify-content: center;
    align-items: center;
  `}
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 3rem 1rem;
  }
`;

const SectionContent = styled.div<{ $narrow?: boolean }>`
  width: 100%;
  max-width: ${props => props.$narrow ? '800px' : '1200px'};
  margin: 0 auto;
`;

export const Section: React.FC<SectionProps & MotionProps> = ({
  id,
  children,
  fullHeight,
  backgroundColor,
  color,
  center,
  narrow,
  animation = 'fade',
  ...rest
}) => {
  const { registerSection, unregisterSection } = useScroll();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      registerSection(id, sectionRef.current);
    }
    
    return () => {
      unregisterSection(id);
    };
  }, [id, registerSection, unregisterSection]);
  
  const selectedVariants = sectionVariants[animation];
  
  return (
    <SectionContainer
      ref={sectionRef}
      id={id}
      $fullHeight={fullHeight}
      $backgroundColor={backgroundColor}
      $color={color}
      $center={center}
      $narrow={narrow}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={selectedVariants}
      {...rest}
    >
      <SectionContent $narrow={narrow}>
        {children}
      </SectionContent>
    </SectionContainer>
  );
};

export default Section;
