import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  height?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

const CarouselContainer = styled.div<{ $height: string }>`
  position: relative;
  width: 100%;
  height: ${props => props.$height};
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

const Dot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.$active ? props.theme.accent.primary : props.theme.text.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.accent.primary};
    outline-offset: 2px;
  }
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
  
  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
  
  &:first-of-type {
    left: 1rem;
  }
  
  &:last-of-type {
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

export const Carousel: React.FC<CarouselProps> = ({ 
  children, 
  autoPlay = false, 
  interval = 5000,
  height = "500px",
  showArrows = true,
  showDots = true
}) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;
  
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<boolean>(false);
  
  const paginate = useCallback((newDirection: number) => {
    setPage(prev => [prev[0] + newDirection, newDirection]);
  }, []);
  
  const goToSlide = useCallback((index: number) => {
    setPage(prev => [index, index > prev[0] ? 1 : -1]);
  }, []);
  
  // Handle autoplay
  useEffect(() => {
    if (autoPlay && !pauseRef.current) {
      autoPlayRef.current = setInterval(() => {
        paginate(1);
      }, interval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval, paginate]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    pauseRef.current = true;
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };
  
  const handleMouseLeave = () => {
    pauseRef.current = false;
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        paginate(1);
      }, interval);
    }
  };
  
  // Normalize page index to handle negative values
  const normalizedPage = ((page % totalSlides) + totalSlides) % totalSlides;
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      paginate(-1);
    } else if (e.key === 'ArrowRight') {
      paginate(1);
    }
  };

  return (
    <CarouselContainer 
      $height={height}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <Slide
          key={normalizedPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${normalizedPage + 1} of ${totalSlides}`}
        >
          {slides[normalizedPage]}
        </Slide>
      </AnimatePresence>

      {showArrows && totalSlides > 1 && (
        <>
          <ArrowButton 
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </ArrowButton>
          <ArrowButton 
            onClick={() => paginate(1)}
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </ArrowButton>
        </>
      )}

      {showDots && totalSlides > 1 && (
        <Controls>
          {slides.map((_, index) => (
            <Dot 
              key={index}
              $active={normalizedPage === index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={normalizedPage === index ? 'true' : 'false'}
            />
          ))}
        </Controls>
      )}
    </CarouselContainer>
  );
};
