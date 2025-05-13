import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Portal } from './Portal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: string;
  fullScreen?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndices?.modal || 1000};
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const ModalContainer = styled(motion.div)<{ $maxWidth?: string; $fullScreen?: boolean }>`
  background-color: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.$fullScreen ? '0' : props.theme.radii?.md || '8px'};
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: ${props => props.$fullScreen ? '100%' : props.$maxWidth || '600px'};
  max-height: ${props => props.$fullScreen ? '100%' : '90vh'};
  overflow-y: auto;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints?.md || '768px'}) {
    max-width: ${props => props.$fullScreen ? '100%' : '90%'};
    max-height: ${props => props.$fullScreen ? '100%' : '80vh'};
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.bg.tertiary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.bg.secondary};
  z-index: 1;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: ${props => props.theme.bg.tertiary};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.accent.primary};
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth,
  fullScreen = false,
  closeOnEsc = true,
  closeOnOverlayClick = true,
}) => {
  const [scrollLocked, setScrollLocked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen && !scrollLocked) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const bodyStyle = document.body.style;
      
      // Save previous focus element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Lock body scroll
      bodyStyle.position = 'fixed';
      bodyStyle.top = `-${scrollY}px`;
      bodyStyle.width = '100%';
      bodyStyle.overflow = 'hidden';
      
      setScrollLocked(true);
    } else if (!isOpen && scrollLocked) {
      // Restore body scroll
      const bodyStyle = document.body.style;
      const scrollY = parseInt(bodyStyle.top || '0', 10) * -1;
      
      bodyStyle.position = '';
      bodyStyle.top = '';
      bodyStyle.width = '';
      bodyStyle.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
      
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      setScrollLocked(false);
    }
    
    return () => {
      if (scrollLocked) {
        const bodyStyle = document.body.style;
        const scrollY = parseInt(bodyStyle.top || '0', 10) * -1;
        
        bodyStyle.position = '';
        bodyStyle.top = '';
        bodyStyle.width = '';
        bodyStyle.overflow = '';
        
        window.scrollTo(0, scrollY);
        
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };
  }, [isOpen, scrollLocked]);
  
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Focus trap inside modal
  useEffect(() => {
    if (!isOpen) return;
    
    const contentElement = contentRef.current;
    if (!contentElement) return;
    
    // Find all focusable elements
    const focusableElements = contentElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element when modal opens
    firstElement.focus();
    
    // Handle tab key to trap focus
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          >
            <ModalContainer
              ref={contentRef}
              $maxWidth={maxWidth}
              $fullScreen={fullScreen}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {title && (
                <ModalHeader>
                  <ModalTitle>{title}</ModalTitle>
                  <CloseButton onClick={onClose} aria-label="Close modal">
                    ×
                  </CloseButton>
                </ModalHeader>
              )}
              <ModalContent>{children}</ModalContent>
            </ModalContainer>
          </Overlay>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;
