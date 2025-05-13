import React, { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react';

interface ScrollContextProps {
  currentSection: string | null;
  registerSection: (id: string, element: HTMLElement) => void;
  unregisterSection: (id: string) => void;
  scrollToSection: (sectionId: string, options?: ScrollOptions) => void;
  saveScrollPosition: (key: string) => void;
  restoreScrollPosition: (key: string, behavior?: ScrollBehavior) => void;
}

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  const scrollPositionsRef = useRef<Map<string, number>>(new Map());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  
  // Register a section element
  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element);
    
    // Set up intersection observer for this element
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.observe(element);
    }
  }, []);
  
  // Unregister a section element
  const unregisterSection = useCallback((id: string) => {
    const element = sectionsRef.current.get(id);
    if (element && intersectionObserverRef.current) {
      intersectionObserverRef.current.unobserve(element);
    }
    sectionsRef.current.delete(id);
  }, []);
  
  // Scroll to a specific section
  const scrollToSection = useCallback((sectionId: string, options: ScrollOptions = {}) => {
    const section = sectionsRef.current.get(sectionId);
    if (section) {
      const { offset = 0, behavior = 'smooth' } = options;
      const top = section.getBoundingClientRect().top + window.pageYOffset + offset;
      
      window.scrollTo({
        top,
        behavior,
      });
    }
  }, []);
  
  // Save current scroll position with a key
  const saveScrollPosition = useCallback((key: string) => {
    scrollPositionsRef.current.set(key, window.pageYOffset);
  }, []);
  
  // Restore saved scroll position
  const restoreScrollPosition = useCallback((key: string, behavior: ScrollBehavior = 'auto') => {
    const position = scrollPositionsRef.current.get(key);
    if (position !== undefined) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior,
        });
      }, 10);
    }
  }, []);
  
  // Set up intersection observer
  useEffect(() => {
    // Options for the intersection observer
    const options = {
      rootMargin: '-50% 0px -50% 0px', // Consider an element in view when it's in the middle 50% of the viewport
      threshold: 0,
    };
    
    // Create intersection observer
    intersectionObserverRef.current = new IntersectionObserver((entries) => {
      // Find the most visible section
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => {
          const element = entry.target as HTMLElement;
          // Find the id for this element by checking our map
          let foundId = null;
          sectionsRef.current.forEach((section, id) => {
            if (section === element) {
              foundId = id;
            }
          });
          const intersectionRatio = entry.intersectionRatio;
          return { id: foundId, intersectionRatio };
        })
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      // Set current section to the most visible one
      if (visibleSections.length > 0 && visibleSections[0].id) {
        setCurrentSection(visibleSections[0].id);
      }
    }, options);
    
    // Observe all already registered sections
    sectionsRef.current.forEach((element) => {
      intersectionObserverRef.current?.observe(element);
    });
    
    return () => {
      // Clean up observer
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);
  
  return (
    <ScrollContext.Provider 
      value={{
        currentSection,
        registerSection,
        unregisterSection,
        scrollToSection,
        saveScrollPosition,
        restoreScrollPosition,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};
