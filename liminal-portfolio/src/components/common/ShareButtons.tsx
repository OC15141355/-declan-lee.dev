import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaLink } from 'react-icons/fa';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ShareButton = styled(motion.button)<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$color};
  color: white;
  cursor: pointer;
  font-size: 1rem;
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.accent.primary};
    outline-offset: 2px;
  }
`;

const ShareText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`;

const CopyNotification = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.accent.primary};
  color: ${props => props.theme.bg.primary};
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, summary = '' }) => {
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // Ensure URL is absolute
  const getAbsoluteUrl = () => {
    if (typeof window === 'undefined') {
      return url;
    }
    
    // Check if the URL is already absolute
    if (url.startsWith('http')) {
      return url;
    }
    
    // If not, construct the absolute URL
    return `${window.location.origin}${url}`;
  };
  
  const absoluteUrl = getAbsoluteUrl();
  
  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(absoluteUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}&summary=${encodeURIComponent(summary)}`;
        break;
    }
    
    // Open in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(absoluteUrl)
      .then(() => {
        setShowCopyNotification(true);
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  return (
    <>
      <ShareContainer>
        <ShareText>Share:</ShareText>
        
        <ShareButton 
          $color="#1DA1F2"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </ShareButton>
        
        <ShareButton 
          $color="#4267B2"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <FaFacebookF />
        </ShareButton>
        
        <ShareButton 
          $color="#0A66C2"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('linkedin')}
          aria-label="Share on LinkedIn"
        >
          <FaLinkedinIn />
        </ShareButton>
        
        <ShareButton 
          $color="#333333"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          aria-label="Copy link"
        >
          <FaLink />
        </ShareButton>
      </ShareContainer>
      
      <AnimatePresence>
        {showCopyNotification && (
          <CopyNotification
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Link copied to clipboard!
          </CopyNotification>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButtons;
