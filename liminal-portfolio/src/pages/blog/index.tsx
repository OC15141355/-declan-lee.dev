import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaTags, FaFolder, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/Layout';
import Section from '../../components/layout/Section';
import Button from '../../components/common/Button';
import { getAllBlogPosts, getAllTags, getAllCategories } from '../../utils/mdx';
import { BlogPost } from '../../types/BlogPost';

interface BlogPageProps {
  posts: BlogPost[];
  tags: { name: string; count: number }[];
  categories: { name: string; count: number }[];
}

const BlogPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 1.1rem;
  max-width: 700px;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchField = styled.div`
  flex: 1;
  position: relative;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: ${props => props.theme.radii.md};
  border: 1px solid ${props => props.theme.bg.tertiary};
  background-color: ${props => props.theme.bg.secondary};
  color: ${props => props.theme.text.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text.secondary};
`;

const FilterSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
`;

const FilterHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.text.secondary};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.button<{ $active?: boolean }>`
  background-color: ${props => props.$active ? props.theme.accent.primary : props.theme.bg.tertiary};
  color: ${props => props.$active ? props.theme.bg.primary : props.theme.text.secondary};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.radii.full};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.accent.primary : props.theme.accent.secondary};
    color: ${props => props.$active ? props.theme.bg.primary : props.theme.text.primary};
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Category = styled.button<{ $active?: boolean }>`
  background-color: ${props => props.$active ? props.theme.accent.primary : props.theme.bg.tertiary};
  color: ${props => props.$active ? props.theme.bg.primary : props.theme.text.secondary};
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.radii.full};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.accent.primary : props.theme.accent.secondary};
    color: ${props => props.$active ? props.theme.bg.primary : props.theme.text.primary};
  }
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.bg.tertiary};
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.radii.full};
  font-size: 0.8rem;
`;

const ClearFilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.accent.primary};
  }
`;

const BlogPostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.div)`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const BlogCardImage = styled.div`
  height: 180px;
  background-color: ${props => props.theme.bg.tertiary};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const BlogCardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BlogCardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text.secondary};
  font-size: 0.8rem;
`;

const BlogCardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const BlogCardSummary = styled.p`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex: 1;
`;

const BlogCardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const BlogCardTag = styled.span`
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.secondary};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.full};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function BlogPage({ posts, tags, categories }: BlogPageProps) {
  const router = useRouter();
  const { query } = router;
  
  // Set up state for filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  
  // Initialize filters from URL query parameters
  useEffect(() => {
    const tagParam = query.tag as string | undefined;
    const categoryParam = query.category as string | undefined;
    const searchParam = query.search as string | undefined;
    
    if (tagParam) {
      setSelectedTags([tagParam]);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [query]);
  
  // Update filtered posts when filters change
  useEffect(() => {
    let filtered = posts;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }
    
    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
    
    // Update URL with filter parameters
    const queryParams = new URLSearchParams();
    
    if (searchTerm) {
      queryParams.set('search', searchTerm);
    }
    
    if (selectedTags.length === 1) {
      queryParams.set('tag', selectedTags[0]);
    }
    
    if (selectedCategory) {
      queryParams.set('category', selectedCategory);
    }
    
    const queryString = queryParams.toString();
    router.push(
      {
        pathname: '/blog',
        search: queryString ? `?${queryString}` : '',
      },
      undefined,
      { shallow: true }
    );
  }, [searchTerm, selectedTags, selectedCategory, posts, router]);
  
  // Toggle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Toggle category selection
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedCategory(null);
    router.push('/blog', undefined, { shallow: true });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Layout title="Blog | Liminal Portfolio" description="Read my latest articles on web development, design, and more.">
      <BlogPageContainer>
        <Section id="blog-header">
          <PageHeader>
            <PageTitle>Blog</PageTitle>
            <PageDescription>
              Thoughts, stories, and ideas on web development, design, and technology.
            </PageDescription>
          </PageHeader>
        </Section>
        
        <Section id="blog-filters">
          <SearchContainer>
            <SearchField>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchField>
            
            {(searchTerm || selectedTags.length > 0 || selectedCategory) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            )}
          </SearchContainer>
          
          <FilterSection>
            <FilterGroup>
              <FilterHeading>
                <FaTags />
                Tags
              </FilterHeading>
              <TagsContainer>
                {tags.map(tag => (
                  <Tag
                    key={tag.name}
                    $active={selectedTags.includes(tag.name)}
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.name} ({tag.count})
                  </Tag>
                ))}
              </TagsContainer>
            </FilterGroup>
            
            <FilterGroup>
              <FilterHeading>
                <FaFolder />
                Categories
              </FilterHeading>
              <CategoriesContainer>
                {categories.map(category => (
                  <Category
                    key={category.name}
                    $active={selectedCategory === category.name}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name} ({category.count})
                  </Category>
                ))}
              </CategoriesContainer>
            </FilterGroup>
          </FilterSection>
          
          {(selectedTags.length > 0 || selectedCategory) && (
            <ActiveFiltersContainer>
              {selectedTags.map(tag => (
                <ActiveFilter key={tag}>
                  <span>{tag}</span>
                  <ClearFilterButton onClick={() => handleTagClick(tag)}>
                    <FaTimes />
                  </ClearFilterButton>
                </ActiveFilter>
              ))}
              
              {selectedCategory && (
                <ActiveFilter>
                  <span>{selectedCategory}</span>
                  <ClearFilterButton onClick={() => setSelectedCategory(null)}>
                    <FaTimes />
                  </ClearFilterButton>
                </ActiveFilter>
              )}
            </ActiveFiltersContainer>
          )}
        </Section>
        
        <Section id="blog-posts">
          {filteredPosts.length > 0 ? (
            <BlogPostsGrid>
              {filteredPosts.map((post, index) => (
                <Link href={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none' }}>
                  <BlogCard
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUpVariants}
                    custom={index}
                  >
                    {post.image && (
                      <BlogCardImage style={{ backgroundImage: `url(${post.image})` }} />
                    )}
                    
                    <BlogCardContent>
                      <BlogCardMeta>
                        <span>{formatDate(post.date)}</span>
                        {post.readingTime && <span>{post.readingTime}</span>}
                      </BlogCardMeta>
                      
                      <BlogCardTitle>{post.title}</BlogCardTitle>
                      <BlogCardSummary>{post.summary}</BlogCardSummary>
                      
                      <BlogCardTags>
                        {post.tags.slice(0, 3).map(tag => (
                          <BlogCardTag key={tag}>{tag}</BlogCardTag>
                        ))}
                        {post.tags.length > 3 && (
                          <BlogCardTag>+{post.tags.length - 3}</BlogCardTag>
                        )}
                      </BlogCardTags>
                    </BlogCardContent>
                  </BlogCard>
                </Link>
              ))}
            </BlogPostsGrid>
          ) : (
            <NoResults>
              <h2>No posts found</h2>
              <p>Try adjusting your search or filter criteria.</p>
              <Button variant="outline" onClick={clearAllFilters} style={{ marginTop: '1rem' }}>
                Clear all filters
              </Button>
            </NoResults>
          )}
        </Section>
      </BlogPageContainer>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogPosts();
  const tags = await getAllTags();
  const categories = await getAllCategories();
  
  return {
    props: {
      posts,
      tags,
      categories,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
};
