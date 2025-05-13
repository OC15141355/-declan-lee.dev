import { Theme } from '../types/Theme';

export const theme: Theme = {
  bg: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2A2A2A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    accent: '#E2E2E2',
  },
  accent: {
    primary: '#64FFDA',
    secondary: '#7F5AF0',
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  zIndices: {
    base: 0,
    menu: 50,
    modal: 100,
    toast: 1000,
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
};

export default theme;
