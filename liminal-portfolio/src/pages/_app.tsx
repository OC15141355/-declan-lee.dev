import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { NavigationProvider } from '../context/NavigationContext';
import { ScrollProvider } from '../context/ScrollContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationProvider>
          <ScrollProvider>
            <Component {...pageProps} />
          </ScrollProvider>
        </NavigationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
