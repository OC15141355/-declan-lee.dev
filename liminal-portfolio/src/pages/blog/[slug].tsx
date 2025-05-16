import React, { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { FaCalendar, FaClock, FaTag, FaChevronLeft, FaShareAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/Layout';
import Section from '../../components/layout/Section';
import Button from '../../components/common/Button';
import ShareButtons from '../../components/common/ShareButtons';
import MDXComponents from '../../components/mdx/MDXComponents';
import TableOfContents from '../../components/blog/TableOfContents';
import { getBlogSlugs, getBlogPostBySlug, getRelatedPosts, generateTableOfContents } from '../../utils/mdx';
import { BlogPost, SerializedBlogPost } from '../../types/BlogPost';
import { useTheme } from '../../context/ThemeContext';

interface BlogPostPageProps {
  post: SerializedBlogPost;
  relatedPosts: BlogPost[];
  tableOfContents: { id: string; text: string; level: number }[];
}

const PostContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PostHeader = styled.div`
  margin-bottom: 2rem;
`;

const PostTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 0.75rem;
  }
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tag = styled(Link)`
  display: inline-flex;
  align-items: center;
  background: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  padding: 0.3rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.accent.primary};
    color: ${props => props.theme.bg.primary};
  }
`;

const FeaturedImage = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
`;

const PostContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const ShareSection = styled.div`
  margin: 3rem 0;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.bg.tertiary};
`;

const ShareHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const RelatedPosts = styled.div`
  margin-top: 3rem;
`;

const RelatedPostsHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const RelatedPostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const RelatedPostCard = styled.div`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Table of Contents Sidebar
const StickyContainer = styled.div`
  position: sticky;
  top: 100px;
`;

const TOCWrapper = styled.div`
  border-left: 2px solid ${props => props.theme.bg.tertiary};
  padding-left: 1rem;
  font-size: 0.9rem;
  max-height: 70vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.bg.tertiary};
    border-radius: 10px;
  }
`;

const TOCTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text.primary};
`;

// Mobile TOC toggle
const MobileTOCToggle = styled(Button)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 90;
`;

const MobileTOCContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.bg.secondary};
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 80vh;
  overflow-y: auto;
`;

// Desktop layout container
const BlogLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export default function BlogPostPage({ post, relatedPosts, tableOfContents }: BlogPostPageProps) {
  const router = useRouter();
  const theme = useTheme();
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const breakpoint = parseInt(theme.theme.breakpoints?.lg || '992', 10);
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [theme.theme.breakpoints]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle Intersection Observer to highlight current section in TOC
  useEffect(() => {
    if (!tableOfContents.length) return;
    
    const headingElements = tableOfContents.map(({ id }) => 
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    
    headingElements.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [tableOfContents]);
  
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <Section id="loading">
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h1>Loading...</h1>
          </div>
        </Section>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${post.title} | Blog`} description={post.summary}>
      <Head>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        {post.image && (
          <meta property="og:image" content={post.image} />
        )}
      </Head>
      
      <Section id="blog-post">
        {isMobile ? (
          // Mobile Layout
          <PostContainer>
            <BackButton 
              variant="text" 
              size="sm" 
              onClick={() => {
                try {
                  // Use direct navigation to blog index instead of router.back()
                  router.push('/blog');
                } catch (error) {
                  console.error('Navigation error:', error);
                  // Fallback to direct URL change if router fails
                  window.location.href = '/blog';
                }
              }}
              icon={<FaChevronLeft />}
            >
              Back to Blog
            </BackButton>
            
            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
              
              <PostMeta>
                <PostMetaItem>
                  <FaCalendar />
                  <span>{formatDate(post.date)}</span>
                </PostMetaItem>
                {post.readingTime && (
                  <PostMetaItem>
                    <FaClock />
                    <span>{post.readingTime}</span>
                  </PostMetaItem>
                )}
                {post.category && (
                  <PostMetaItem>
                    <FaTag />
                    <Link href={`/blog?category=${post.category}`}>
                      <span style={{ cursor: 'pointer' }}>{post.category}</span>
                    </Link>
                  </PostMetaItem>
                )}
              </PostMeta>
              
              {post.tags && post.tags.length > 0 && (
                <TagsContainer>
                  {post.tags.map(tag => (
                    <Tag href={`/blog?tag=${tag}`} key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </TagsContainer>
              )}
              
              {post.image && (
                <FeaturedImage>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={450}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </FeaturedImage>
              )}
            </PostHeader>
            
            <PostContent>
              <MDXRemote {...post.content} components={MDXComponents} />
            </PostContent>
            
            {/* Share Section */}
            <ShareSection>
              <ShareHeading>
                <FaShareAlt />
                Share this article
              </ShareHeading>
              <ShareButtons url={`/blog/${post.slug}`} title={post.title} summary={post.summary} />
            </ShareSection>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <RelatedPosts>
                <RelatedPostsHeading>Related Posts</RelatedPostsHeading>
                <RelatedPostGrid>
                  {relatedPosts.map(relatedPost => (
                    <RelatedPostCard key={relatedPost.id}>
                      <Link 
                        href={`/blog/${relatedPost.slug}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{relatedPost.title}</h3>
                        <div style={{ fontSize: '0.8rem', color: theme.theme.text.secondary, marginBottom: '0.5rem' }}>
                          {formatDate(relatedPost.date)}
                        </div>
                      </Link>
                    </RelatedPostCard>
                  ))}
                </RelatedPostGrid>
              </RelatedPosts>
            )}
            
            {/* Mobile TOC Toggle */}
            {tableOfContents.length > 0 && (
              <>
                <MobileTOCToggle
                  size="sm"
                  onClick={() => setTocOpen(true)}
                  icon={<FaChevronLeft style={{ transform: 'rotate(-90deg)' }} />}
                >
                  Contents
                </MobileTOCToggle>
                
                <AnimatePresence>
                  {tocOpen && (
                    <MobileTOCContainer
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 20 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <TOCTitle>Table of Contents</TOCTitle>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => setTocOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                      
                      <TableOfContents
                        headings={tableOfContents}
                        activeId={activeId}
                        onClick={(id) => {
                          setTocOpen(false);
                          setActiveId(id);
                        }}
                      />
                    </MobileTOCContainer>
                  )}
                </AnimatePresence>
              </>
            )}
          </PostContainer>
        ) : (
          // Desktop Layout
          <BlogLayout>
            <PostContainer>
              <BackButton 
                variant="text" 
                size="sm" 
                onClick={() => {
                  try {
                    // Use direct navigation to blog index instead of router.back()
                    router.push('/blog');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    // Fallback to direct URL change if router fails
                    window.location.href = '/blog';
                  }
                }}
                icon={<FaChevronLeft />}
              >
                Back to Blog
              </BackButton>
              
              <PostHeader>
                <PostTitle>{post.title}</PostTitle>
                
                <PostMeta>
                  <PostMetaItem>
                    <FaCalendar />
                    <span>{formatDate(post.date)}</span>
                  </PostMetaItem>
                  {post.readingTime && (
                    <PostMetaItem>
                      <FaClock />
                      <span>{post.readingTime}</span>
                    </PostMetaItem>
                  )}
                  {post.category && (
                    <PostMetaItem>
                      <FaTag />
                      <Link href={`/blog?category=${post.category}`}>
                        <span style={{ cursor: 'pointer' }}>{post.category}</span>
                      </Link>
                    </PostMetaItem>
                  )}
                </PostMeta>
                
                {post.tags && post.tags.length > 0 && (
                  <TagsContainer>
                    {post.tags.map(tag => (
                      <Tag href={`/blog?tag=${tag}`} key={tag}>
                        {tag}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
                
                {post.image && (
                  <FeaturedImage>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={800}
                      height={450}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </FeaturedImage>
                )}
              </PostHeader>
              
              <PostContent>
                <MDXRemote {...post.content} components={MDXComponents} />
              </PostContent>
              
              {/* Share Section */}
              <ShareSection>
                <ShareHeading>
                  <FaShareAlt />
                  Share this article
                </ShareHeading>
                <ShareButtons url={`/blog/${post.slug}`} title={post.title} summary={post.summary} />
              </ShareSection>
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <RelatedPosts>
                  <RelatedPostsHeading>Related Posts</RelatedPostsHeading>
                  <RelatedPostGrid>
                    {relatedPosts.map(relatedPost => (
                      <RelatedPostCard key={relatedPost.id}>
                        <Link 
                          href={`/blog/${relatedPost.slug}`} 
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{relatedPost.title}</h3>
                          <div style={{ fontSize: '0.8rem', color: theme.theme.text.secondary, marginBottom: '0.5rem' }}>
                            {formatDate(relatedPost.date)}
                          </div>
                        </Link>
                      </RelatedPostCard>
                    ))}
                  </RelatedPostGrid>
                </RelatedPosts>
              )}
            </PostContainer>
            
            {/* Table of Contents Sidebar */}
            <StickyContainer>
              {tableOfContents.length > 0 && (
                <TOCWrapper>
                  <TOCTitle>Table of Contents</TOCTitle>
                  <TableOfContents
                    headings={tableOfContents}
                    activeId={activeId}
                  />
                </TOCWrapper>
              )}
            </StickyContainer>
          </BlogLayout>
        )}
      </Section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getBlogSlugs();
  
  return {
    paths: slugs.map(slug => ({ params: { slug: slug.replace(/\.mdx$/, '') } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const post = await getBlogPostBySlug(slug);
    // Convert SerializedBlogPost to BlogPost for getRelatedPosts
    const postForRelated: BlogPost = {
      ...post,
      content: '', // Replace MDX content with empty string
    };
    const relatedPosts = await getRelatedPosts(postForRelated, 3);
    const tableOfContents = generateTableOfContents(post.rawContent);
    
    return {
      props: {
        post,
        relatedPosts,
        tableOfContents,
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error in getStaticProps for blog post:", error);
    return {
      notFound: true,
    };
  }
};
