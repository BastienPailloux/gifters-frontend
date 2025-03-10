import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  /* Importer les polices Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.default};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.typography.fontFamily.secondary};
    font-weight: ${theme.typography.fontWeight.semiBold};
    line-height: ${theme.typography.lineHeight.tight};
    margin-bottom: ${theme.spacing[4]};
    color: ${theme.colors.text.primary};
  }

  h1 {
    font-size: ${theme.typography.fontSize['4xl']};
  }

  h2 {
    font-size: ${theme.typography.fontSize['3xl']};
  }

  h3 {
    font-size: ${theme.typography.fontSize['2xl']};
  }

  h4 {
    font-size: ${theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${theme.spacing[4]};
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primary.dark};
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  img, svg {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  /* Utilitaires */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing[4]};
  }

  /* Accessibilité */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Scrollbar personnalisée */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.alt};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.dark};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.hint};
  }
`;

export default GlobalStyles;
