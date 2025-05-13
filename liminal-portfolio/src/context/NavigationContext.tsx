import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface NavigationContextProps {
  currentPage: string;
  previousPage: string | null;
  setPage: (page: string) => void;
  navigateTo: (path: string) => void;
  isNavigating: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<string>('/');
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  // Update current page based on router
  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);
  
  // Handle internal page navigation
  const setPage = useCallback((page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  }, [currentPage]);
  
  // Navigate to a specific path
  const navigateTo = useCallback((path: string) => {
    setIsNavigating(true);
    setPreviousPage(currentPage);
    router.push(path).finally(() => {
      setIsNavigating(false);
    });
  }, [currentPage, router]);
  
  // Mobile menu toggle
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);
  
  // Close mobile menu
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);
  
  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      closeMenu();
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events, closeMenu]);
  
  return (
    <NavigationContext.Provider 
      value={{
        currentPage,
        previousPage,
        setPage,
        navigateTo,
        isNavigating,
        menuOpen,
        toggleMenu,
        closeMenu,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
