export interface Theme {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  space: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndices: {
    base: number;
    menu: number;
    modal: number;
    toast: number;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  cards: {
    width: string;
    height: string;
    imageHeight: string;
    contentPadding: {
      vertical: string;
      horizontal: string;
    };
    titleMargin: string;
    summaryMargin: string;
    gap: string;
    background: string;
    backdropFilter: string;
    border: string;
    borderRadius: string;
    hoverElevation: string;
    hoverTransform: string;
    transition: string;
    titleColor: string;
    summaryColor: string;
    tagBackground: string;
    tagColor: string;
    tagBorder: string;
    imageOverlay: string;
  };
}
