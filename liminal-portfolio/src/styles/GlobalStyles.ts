import { createGlobalStyle } from 'styled-components';
import { Theme } from '../types/Theme';

const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${props => props.theme.fonts.body};
    background-color: ${props => props.theme.bg.primary};
    color: ${props => props.theme.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    margin-bottom: ${props => props.theme.space.md};
    font-weight: 700;
    line-height: 1.2;
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }

  h4 {
    font-size: ${props => props.theme.fontSizes.xl};
  }

  p {
    margin-bottom: ${props => props.theme.space.md};
  }

  a {
    color: ${props => props.theme.accent.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.text.primary};
    }
  }

  button {
    font-family: ${props => props.theme.fonts.body};
    cursor: pointer;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  code {
    font-family: ${props => props.theme.fonts.mono};
  }

  /* Accessibility */
  :focus-visible {
    outline: 2px solid ${props => props.theme.accent.primary};
    outline-offset: 2px;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.bg.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.bg.tertiary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.accent.secondary};
  }
`;

export default GlobalStyles;
