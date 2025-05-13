import React from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

interface TableOfContentsProps {
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
  activeId?: string;
  onClick?: (id: string) => void;
}

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li<{ $level: number; $active: boolean }>`
  padding-left: ${props => (props.$level - 1) * 0.75}rem;
  margin-bottom: 0.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${props => props.$active ? props.theme.accent.primary : 'transparent'};
  }
`;

const TOCLink = styled.a<{ $active: boolean }>`
  text-decoration: none;
  color: ${props => props.$active ? props.theme.accent.primary : props.theme.text.secondary};
  font-size: ${props => props.$active ? '0.95rem' : '0.9rem'};
  font-weight: ${props => props.$active ? '500' : '400'};
  transition: all 0.2s ease;
  display: inline-block;
  
  &:hover {
    color: ${props => props.theme.accent.primary};
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${props => props.theme.accent.primary};
`;

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  headings, 
  activeId = '',
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // Scroll to the heading
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Call the onClick callback if provided
    if (onClick) {
      onClick(id);
    }
  };
  
  if (headings.length === 0) {
    return null;
  }
  
  return (
    <TOCList>
      {headings.map(heading => (
        <TOCItem 
          key={heading.id} 
          $level={heading.level}
          $active={activeId === heading.id}
        >
          <AnimatePresence mode="wait">
            {activeId === heading.id && (
              <ActiveIndicator 
                layoutId="toc-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          
          <TOCLink
            href={`#${heading.id}`}
            $active={activeId === heading.id}
            onClick={(e) => handleClick(e, heading.id)}
          >
            {heading.text}
          </TOCLink>
        </TOCItem>
      ))}
    </TOCList>
  );
};

export default TableOfContents;
