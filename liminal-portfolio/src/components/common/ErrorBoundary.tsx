import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  padding: 2rem;
  margin: 2rem;
  background: ${props => props.theme.bg.secondary};
  border-radius: ${props => props.theme.radii.md};
  border-left: 4px solid #f44336;
`;

const ErrorHeading = styled.h2`
  color: #f44336;
  margin-bottom: 1rem;
`;

const ErrorButton = styled.button`
  background: ${props => props.theme.accent.primary};
  color: ${props => props.theme.bg.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.radii.sm};
  margin-top: 1rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("Component Error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <p>An error occurred while rendering this component.</p>
          <ErrorButton onClick={() => this.setState({ hasError: false })}>
            Try again
          </ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
