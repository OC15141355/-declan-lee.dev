import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
