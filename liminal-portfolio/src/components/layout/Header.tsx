import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigation } from '../../context/NavigationContext';

interface HeaderProps {
  transparent?: boolean;
}

const HeaderContainer = styled.header<{ $isScrolled: boolean; $transparent?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${props => props.theme.zIndices?.menu || 100};
  padding: ${props => props.$isScrolled ? '0.75rem 1rem' : '1.5rem 1rem'};
  background-color: ${props => 
    props.$transparent && !props.$isScrolled 
      ? 'transparent' 
      : `${props.theme.bg.primary}E6`}; // E6 for slight transparency
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.$isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease-in-out;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center; // Center the navigation
`;

const Nav = styled.nav`
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// New styled component for navigation dots
const NavDot = styled.div<{ $isActive?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.text.primary};
  background-color: ${props => props.$isActive ? props.theme.text.primary : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  margin-bottom: 6px; // Space for the text below
  display: block; // Ensure full click area
  
  &:hover {
    transform: scale(1.2);
  }
`;

// New component for the text beneath dots
const NavText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.text.secondary};
  transition: color 0.3s ease;
`;

// Mobile dots container that replaces the hamburger menu
const MobileDotsContainer = styled.div`
  display: none;
  justify-content: center;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    display: flex;
  }
`;

// Mobile version of the navigation dot
const MobileDot = styled(NavDot)`
  width: 14px;
  height: 14px;
  margin-bottom: 0; // No text beneath in mobile
  padding: 10px; // Add padding to increase click area
  margin: -10px; // Offset padding to maintain visual size
`;

export const Header: React.FC<HeaderProps> = ({ transparent }) => {
  const { currentPage, navigateTo } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
  ];
  
  return (
    <HeaderContainer $isScrolled={isScrolled} $transparent={transparent}>
      <HeaderContent>
        {/* Desktop Navigation with dots and text */}
        <Nav>
          <NavList>
            {navItems.map(item => (
              <NavItem key={item.path}>
                <NavDot 
                  $isActive={currentPage === item.path} 
                  onClick={() => navigateTo(item.path)}
                />
                <NavText onClick={() => navigateTo(item.path)} style={{ cursor: 'pointer' }}>
                  {item.name}
                </NavText>
              </NavItem>
            ))}
          </NavList>
        </Nav>
        
        {/* Mobile Navigation with just dots */}
        <MobileDotsContainer>
          {navItems.map(item => (
            <MobileDot 
              key={item.path}
              $isActive={currentPage === item.path} 
              onClick={() => navigateTo(item.path)}
            />
          ))}
        </MobileDotsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
