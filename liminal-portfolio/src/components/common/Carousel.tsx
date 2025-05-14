import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin: 2rem 0;
  border-radius: ${props => props.theme.radii.lg};
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
`;

const Slide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.active ? props.theme.accent.primary : props.theme.text.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0,0,0,0.7);
  }
  
  &:first-child {
    left: 1rem;
  }
  
  &:last-child {
    right: 1rem;
  }
`;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const images = React.Children.toArray(children);
  
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <CarouselContainer>
      <AnimatePresence initial={false} custom={direction}>
        <Slide
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {images[Math.abs(page % images.length)]}
        </Slide>
      </AnimatePresence>

      <ArrowButton onClick={() => paginate(-1)}>
        {'<'}
      </ArrowButton>
      <ArrowButton onClick={() => paginate(1)}>
        {'>'}
      </ArrowButton>

      <Controls>
        {images.map((_, index) => (
          <Dot 
            key={index}
            active={Math.abs(page % images.length) === index}
            onClick={() => setPage([index, index > page ? 1 : -1])}
          />
        ))}
      </Controls>
    </CarouselContainer>
  );
};
