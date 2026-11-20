export const colors = {
  primary: '#FF4F21',
  primaryLight: '#FF6B35',
  primaryDark: '#E03D15',
  
  secondary: '#22A45D',
  secondaryLight: '#2DC76D',
  secondaryDark: '#1A8A4A',
  
  neutral: {
    50: '#FFFFFF',
    100: '#F7F7F7',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF'
  },
  
  background: {
    default: '#F7F7F7',
    paper: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  
  success: '#22A45D',
  warning: '#FFB800',
  error: '#D32F2F',
  info: '#2196F3'
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