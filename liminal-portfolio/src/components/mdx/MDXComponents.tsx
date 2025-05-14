import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { FiExternalLink, FiCode, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { Carousel } from '../common/Carousel';

// Styled components for MDX content
const Heading1 = styled.h1`
  font-size: 2.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const Heading2 = styled.h2`
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.3;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.75rem;
  }
`;

const Heading3 = styled.h3`
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.35rem;
  }
`;

const Heading4 = styled.h4`
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.8;
`;

const UnorderedList = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }
`;

const OrderedList = styled.ol`
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }
`;

const Blockquote = styled.blockquote`
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  border-left: 4px solid ${props => props.theme.accent.primary};
  color: ${props => props.theme.text.secondary};
  font-style: italic;
`;

const CodeBlock = styled.pre`
  background-color: ${props => props.theme.bg.tertiary};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  
  code {
    background-color: transparent;
    padding: 0;
    font-family: inherit;
  }
`;

const InlineCode = styled.code`
  background-color: ${props => props.theme.bg.tertiary};
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85em;
`;

const Anchor = styled.a`
  color: ${props => props.theme.accent.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
`;

const ImageCaption = styled.figcaption`
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme.text.secondary};
  margin-top: 0.5rem;
`;

// Custom Components
const CalloutBox = styled.div<{ $variant?: 'info' | 'warning' | 'tip' }>`
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  
  ${props => {
    switch (props.$variant) {
      case 'warning':
        return `
          background-color: rgba(255, 169, 0, 0.1);
          border-left: 4px solid #FFA900;
        `;
      case 'tip':
        return `
          background-color: rgba(139, 195, 74, 0.1);
          border-left: 4px solid #8BC34A;
        `;
      case 'info':
      default:
        return `
          background-color: rgba(97, 218, 251, 0.1);
          border-left: 4px solid #61DAFB;
        `;
    }
  }}
`;

const CalloutIconWrapper = styled.div`
  color: ${props => props.theme.accent.primary};
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const CalloutContent = styled.div`
  flex: 1;
  
  > *:last-child {
    margin-bottom: 0;
  }
`;

// Custom MDX Components
interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
}) => {
  return (
    <figure style={{ margin: '0 0 1.5rem 0' }}>
      <ImageWrapper>
        <Image 
          src={src} 
          alt={alt} 
          width={width} 
          height={height} 
          style={{ width: '100%', height: 'auto' }} 
        />
      </ImageWrapper>
      {caption && <ImageCaption>{caption}</ImageCaption>}
    </figure>
  );
};

interface CalloutProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'tip';
}

const Callout: React.FC<CalloutProps> = ({ children, variant = 'info' }) => {
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <FiAlertTriangle />;
      case 'tip':
        return <FiCode />;
      case 'info':
      default:
        return <FiInfo />;
    }
  };
  
  return (
    <CalloutBox $variant={variant}>
      <CalloutIconWrapper>{getIcon()}</CalloutIconWrapper>
      <CalloutContent>{children}</CalloutContent>
    </CalloutBox>
  );
};

// MDX components mapping
const MDXComponents = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  blockquote: Blockquote,
  pre: CodeBlock,
  code: InlineCode,
  Image,
  a: ({ href = '', ...props }) => {
    const isExternal = href.startsWith('http');
    
    if (isExternal) {
      return (
        <Anchor
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {props.children}
          <FiExternalLink style={{ marginLeft: '4px', fontSize: '0.875em' }} />
        </Anchor>
      );
    }
    
    return (
      <Link href={href} passHref legacyBehavior>
        <Anchor {...props} />
      </Link>
    );
  },
  // Custom components
  ImageWithCaption,
  Callout,
  Carousel: (props: React.ComponentProps<typeof Carousel>) => <Carousel {...props} />,
};

export default MDXComponents;
