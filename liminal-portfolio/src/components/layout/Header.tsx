import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  
  a {
    color: ${props => props.theme.text.primary};
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.accent.primary};
    }
  }
`;

const Nav = styled.nav`
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.a<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? props.theme.accent.primary : props.theme.text.primary};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  padding: 0.5rem 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$isActive ? '100%' : '0%'};
    height: 2px;
    background-color: ${props => props.theme.accent.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.accent.primary};
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.bg.primary};
  z-index: ${props => props.theme.zIndices?.modal || 1000};
  padding: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    display: flex;
    flex-direction: column;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuClose = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileNavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 0;
`;

const MobileNavItem = styled.li`
  font-size: 1.5rem;
`;

const MobileNavLink = styled.a<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? props.theme.accent.primary : props.theme.text.primary};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  display: block;
  padding: 0.5rem;
`;

export const Header: React.FC<HeaderProps> = ({ transparent }) => {
  const { currentPage, menuOpen, toggleMenu, closeMenu } = useNavigation();
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
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  return (
    <>
      <HeaderContainer $isScrolled={isScrolled} $transparent={transparent}>
        <HeaderContent>
          <Logo>
            <Link href="/" passHref legacyBehavior>
              <a>Liminal</a>
            </Link>
          </Logo>
          
          <Nav>
            <NavList>
              {navItems.map(item => (
                <NavItem key={item.path}>
                  <Link href={item.path} passHref legacyBehavior>
                    <NavLink $isActive={currentPage === item.path}>
                      {item.name}
                    </NavLink>
                  </Link>
                </NavItem>
              ))}
            </NavList>
          </Nav>
          
          <MobileMenuButton onClick={toggleMenu} aria-label="Open menu">
            ☰
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>
      
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <MobileMenuHeader>
              <Logo>
                <Link href="/" passHref legacyBehavior>
                  <a onClick={closeMenu}>Liminal</a>
                </Link>
              </Logo>
              <MobileMenuClose onClick={closeMenu} aria-label="Close menu">
                ✕
              </MobileMenuClose>
            </MobileMenuHeader>
            
            <MobileNavList>
              {navItems.map(item => (
                <MobileNavItem key={item.path}>
                  <Link href={item.path} passHref legacyBehavior>
                    <MobileNavLink 
                      $isActive={currentPage === item.path}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </MobileNavLink>
                  </Link>
                </MobileNavItem>
              ))}
            </MobileNavList>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
