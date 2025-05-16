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
  
  // Navigate to a specific path with enhanced error handling
  const navigateTo = useCallback((path: string) => {
    // Validate path format
    if (!path.startsWith('/')) {
      console.error('Invalid navigation path - must start with /');
      return Promise.reject(new Error('Invalid path'));
    }

    setIsNavigating(true);
    setPreviousPage(currentPage);
    
    // Use try-catch with async/await for better error handling
    const navigate = async () => {
      try {
        // Use router.push with specific options to avoid SecurityError
        await router.push(path, undefined, { 
          scroll: true,
          shallow: false // Avoid shallow routing which can cause SecurityError
        });
        return true;
      } catch (error) {
        // Specifically handle SecurityError
        if (error instanceof DOMException && error.name === 'SecurityError') {
          console.error('SecurityError during navigation. Using alternative method.');
          
          // Alternative navigation approach using replace instead of push
          try {
            await router.replace(path);
            return true;
          } catch (fallbackError) {
            console.error('Fallback navigation failed:', fallbackError);
            // Last resort: try to navigate to home page
            if (path !== '/') {
              await router.replace('/');
            }
            return false;
          }
        } else {
          // Handle other errors
          console.error('Navigation failed:', error);
          // Fallback to home page if navigation fails
          if (path !== '/') {
            await router.replace('/');
          }
          return false;
        }
      } finally {
        setIsNavigating(false);
      }
    };
    
    return navigate();
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
