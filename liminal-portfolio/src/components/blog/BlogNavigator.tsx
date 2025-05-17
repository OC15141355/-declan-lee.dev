import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaChevronRight, FaCalendar, FaFolder } from 'react-icons/fa';
import { BlogPost } from '../../types/BlogPost';

interface BlogNavigatorProps {
  posts: BlogPost[];
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

interface PostsByDate {
  [year: string]: {
    [month: string]: BlogPost[];
  };
}

const NavigatorContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const CategorySection = styled.div`
  margin-bottom: 1rem;
`;

const CategoryHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text.secondary};
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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

const TreeContainer = styled.div`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  padding: 0.5rem;
`;

const TreeHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text.secondary};
`;

const TreeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TreeItem = styled.li`
  margin-bottom: 0.5rem;
`;

const YearItem = styled.div`
  margin-bottom: 0.5rem;
`;

const YearHeader = styled.div<{ $hasItems: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: ${props => props.theme.radii.sm};
  background-color: ${props => props.theme.bg.tertiary};
  color: ${props => props.theme.text.primary};
  cursor: ${props => props.$hasItems ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$hasItems ? props.theme.bg.tertiary : props.theme.bg.tertiary};
    opacity: ${props => props.$hasItems ? 0.8 : 1};
  }
`;

const MonthItem = styled.div`
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
`;

const MonthHeader = styled.div<{ $hasItems: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: ${props => props.theme.radii.sm};
  color: ${props => props.theme.text.secondary};
  cursor: ${props => props.$hasItems ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$hasItems ? props.theme.bg.tertiary : 'transparent'};
  }
`;

const PostList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0.5rem 1.5rem;
`;

const PostItem = styled.li`
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6rem;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${props => props.theme.accent.primary};
  }
`;

const PostLink = styled(Link)`
  color: ${props => props.theme.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.accent.primary};
  }
`;

const NoPostsMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.text.secondary};
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlogNavigator: React.FC<BlogNavigatorProps> = ({
  posts,
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [postsByDate, setPostsByDate] = useState<PostsByDate>({});
  
  // Group posts by year and month
  useEffect(() => {
    const filteredPosts = selectedCategory
      ? posts.filter(post => post.category === selectedCategory)
      : posts;
    
    const grouped: PostsByDate = {};
    
    filteredPosts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      
      grouped[year][month].push(post);
    });
    
    // Sort years in descending order (newest first)
    const sortedByDate: PostsByDate = {};
    Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .forEach(year => {
        sortedByDate[year] = {};
        
        // Sort months in descending order (newest first)
        const monthOrder = [
          'December', 'November', 'October', 'September', 'August', 'July',
          'June', 'May', 'April', 'March', 'February', 'January'
        ];
        
        monthOrder.forEach(month => {
          if (grouped[year][month]) {
            sortedByDate[year][month] = grouped[year][month].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          }
        });
      });
    
    setPostsByDate(sortedByDate);
    
    // Auto-expand the most recent year if no years are expanded
    if (expandedYears.size === 0 && Object.keys(sortedByDate).length > 0) {
      const mostRecentYear = Object.keys(sortedByDate)[0];
      setExpandedYears(new Set([mostRecentYear]));
      
      // Auto-expand the most recent month in that year
      if (Object.keys(sortedByDate[mostRecentYear]).length > 0) {
        const mostRecentMonth = Object.keys(sortedByDate[mostRecentYear])[0];
        setExpandedMonths(new Set([`${mostRecentYear}-${mostRecentMonth}`]));
      }
    }
  }, [posts, selectedCategory]);
  
  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };
  
  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(yearMonth)) {
        newSet.delete(yearMonth);
      } else {
        newSet.add(yearMonth);
      }
      return newSet;
    });
  };
  
  return (
    <NavigatorContainer>
      <CategorySection>
        <CategoryHeading>
          <FaFolder />
          Categories
        </CategoryHeading>
        <CategoriesContainer>
          <Category
            $active={selectedCategory === null}
            onClick={() => onCategorySelect(null)}
          >
            All
          </Category>
          {categories.map(category => (
            <Category
              key={category.name}
              $active={selectedCategory === category.name}
              onClick={() => onCategorySelect(category.name)}
            >
              {category.name} ({category.count})
            </Category>
          ))}
        </CategoriesContainer>
      </CategorySection>
      
      <TreeContainer>
        <TreeHeading>
          <FaCalendar />
          Blog Posts
        </TreeHeading>
        
        {Object.keys(postsByDate).length > 0 ? (
          <TreeList>
            {Object.entries(postsByDate).map(([year, months]) => {
              const hasMonths = Object.keys(months).length > 0;
              const isYearExpanded = expandedYears.has(year);
              
              return (
                <TreeItem key={year}>
                  <YearItem>
                    <YearHeader
                      $hasItems={hasMonths}
                      onClick={() => hasMonths && toggleYear(year)}
                    >
                      <ChevronIcon
                        animate={{ rotate: isYearExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {hasMonths && <FaChevronRight />}
                      </ChevronIcon>
                      <span>{year}</span>
                    </YearHeader>
                    
                    <AnimatePresence>
                      {isYearExpanded && hasMonths && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {Object.entries(months).map(([month, monthPosts]) => {
                            const monthKey = `${year}-${month}`;
                            const isMonthExpanded = expandedMonths.has(monthKey);
                            
                            return (
                              <MonthItem key={monthKey}>
                                <MonthHeader
                                  $hasItems={monthPosts.length > 0}
                                  onClick={() => monthPosts.length > 0 && toggleMonth(monthKey)}
                                >
                                  <ChevronIcon
                                    animate={{ rotate: isMonthExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {monthPosts.length > 0 && <FaChevronRight />}
                                  </ChevronIcon>
                                  <span>{month}</span>
                                </MonthHeader>
                                
                                <AnimatePresence>
                                  {isMonthExpanded && (
                                    <PostList
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {monthPosts.map(post => (
                                        <PostItem key={post.id}>
                                          <PostLink href={`/blog/${post.slug}`}>
                                            {post.title}
                                          </PostLink>
                                        </PostItem>
                                      ))}
                                    </PostList>
                                  )}
                                </AnimatePresence>
                              </MonthItem>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </YearItem>
                </TreeItem>
              );
            })}
          </TreeList>
        ) : (
          <NoPostsMessage>
            No posts found in this category.
          </NoPostsMessage>
        )}
      </TreeContainer>
    </NavigatorContainer>
  );
};

export default BlogNavigator;
