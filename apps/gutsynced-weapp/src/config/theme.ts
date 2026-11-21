export const colors = {
  primary: '#6750A4',
  primaryLight: '#9C82C4',
  primaryDark: '#4F378B',
  
  secondary: '#9C82C4',
  secondaryLight: '#B9A5D9',
  secondaryDark: '#7E67B3',
  
  neutral: {
    50: '#FFFFFF',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#9E9E9E',
    600: '#6C757D',
    700: '#515154',
    800: '#3A3A3C',
    900: '#1B1B1C'
  },
  
  text: {
    primary: '#1B1B1C',
    secondary: '#6C757D',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF'
  },
  
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  
  success: '#16A34A',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#275AC5'
}

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System'
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
}

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999
}

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
}

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows
}

export type Theme = typeof theme
export default theme