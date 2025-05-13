import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

const buttonSizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  md: css`
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
  `,
  lg: css`
    padding: 0.75rem 1.75rem;
    font-size: 1.125rem;
  `,
};

const buttonVariantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.accent.primary};
    color: ${({ theme }) => theme.bg.primary};
    border: 1px solid ${({ theme }) => theme.accent.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.accent.primary}CC;
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.bg.tertiary};
    color: ${({ theme }) => theme.text.primary};
    border: 1px solid ${({ theme }) => theme.bg.tertiary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.bg.tertiary}CC;
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.accent.primary};
    border: 1px solid ${({ theme }) => theme.accent.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.accent.primary}1A;
    }
  `,
  text: css`
    background-color: transparent;
    color: ${({ theme }) => theme.accent.primary};
    border: none;
    padding-left: 0;
    padding-right: 0;
    
    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.text.primary};
    }
  `,
};

const ButtonStyles = css<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  
  /* Apply size styles */
  ${({ $size }) => buttonSizeStyles[$size]}
  
  /* Apply variant styles */
  ${({ $variant }) => buttonVariantStyles[$variant]}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Icon positioning */
  ${({ $hasIcon, $iconPosition }) => $hasIcon && $iconPosition === 'right' && css`
    flex-direction: row-reverse;
  `}
  
  /* Hover effect */
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
}>`
  ${ButtonStyles}
`;

const StyledLinkButton = styled.a<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $hasIcon: boolean;
  $iconPosition: 'left' | 'right';
}>`
  ${ButtonStyles}
  text-decoration: none;
`;

const LoadingSpinner = styled.span`
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  external = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled,
  ...rest
}) => {
  const hasIcon = !!icon || isLoading;
  const buttonProps = {
    $variant: variant,
    $size: size,
    $fullWidth: fullWidth,
    $hasIcon: hasIcon,
    $iconPosition: iconPosition,
    disabled: disabled || isLoading,
  };
  
  const content = (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && icon && icon}
      <span>{children}</span>
    </>
  );
  
  // Render as link if href is provided
  if (href) {
    if (external) {
      return (
        <StyledLinkButton
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...buttonProps}
        >
          {content}
        </StyledLinkButton>
      );
    }
    
    return (
      <Link href={href} passHref legacyBehavior>
        <StyledLinkButton {...buttonProps}>
          {content}
        </StyledLinkButton>
      </Link>
    );
  }
  
  // Render as button
  return (
    <StyledButton
      {...buttonProps}
      {...rest}
    >
      {content}
    </StyledButton>
  );
};

export default Button;
