import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface AnimatedTextProps {
  text: string;
  element?: TextElement;
  animation?: 'words' | 'letters' | 'lines';
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}

const TextContainer = styled(motion.div)`
  overflow: hidden;
  display: inline-block;
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Letter = styled(motion.span)`
  display: inline-block;
  position: relative;
`;

const Line = styled(motion.div)`
  overflow: hidden;
`;

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  element = 'p',
  animation = 'words',
  className,
  staggerChildren = 0.05,
  delayChildren = 0,
  once = true,
}) => {
  const TextElement = element as React.ElementType;
  
  // Split text into words, letters, or lines
  const getTextElements = () => {
    switch (animation) {
      case 'words':
        return text.split(' ').map((word, i) => (
          <Word
            key={i}
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            {word}
          </Word>
        ));
      case 'letters':
        return text.split('').map((letter, i) => (
          <Letter
            key={i}
            variants={{
              hidden: { y: '50%', opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </Letter>
        ));
      case 'lines':
        return text.split('\n').map((line, i) => (
          <Line
            key={i}
            variants={{
              hidden: { y: '100%' },
              visible: { y: 0 },
            }}
          >
            {line}
          </Line>
        ));
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <TextElement className={className}>
      <TextContainer
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
      >
        {getTextElements()}
      </TextContainer>
    </TextElement>
  );
};

export default AnimatedText;
