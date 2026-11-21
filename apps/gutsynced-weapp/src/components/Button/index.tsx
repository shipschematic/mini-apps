import { Component } from 'react'
import { View, Text } from '@tarojs/components'

interface ButtonProps {
  text?: string
  size?: 'small' | 'regular' | 'medium' | 'large'
  type?: 'regular' | 'outline' | 'ghost' | 'pill' | 'primary'
  state?: 'default' | 'hover' | 'active' | 'disabled'
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

export default class Button extends Component<ButtonProps> {
  static defaultProps = {
    size: 'regular',
    type: 'primary',
    state: 'default',
    text: 'Button',
    fullWidth: false
  }

  render() {
    const { text = 'Button', size = 'regular', type = 'primary', disabled, fullWidth, onClick } = this.props

    const sizeStyles: Record<string, any> = {
      small: { padding: '8px 16px', fontSize: '14px', minHeight: '32px', borderRadius: '8px' },
      regular: { padding: '12px 20px', fontSize: '16px', minHeight: '40px', borderRadius: '12px' },
      medium: { padding: '14px 24px', fontSize: '18px', minHeight: '48px', borderRadius: '12px' },
      large: { padding: '16px 32px', fontSize: '18px', minHeight: '56px', borderRadius: '12px' }
    }

    const typeStyles: Record<string, any> = {
      regular: { backgroundColor: 'var(--color-primary-container)', color: '#FFFFFF' },
      outline: { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '2px solid var(--color-primary)' },
      ghost: { backgroundColor: 'transparent', color: 'var(--color-primary)' },
      pill: { backgroundColor: 'var(--color-primary-container)', color: '#FFFFFF', borderRadius: '9999px' },
      primary: { backgroundColor: 'var(--color-primary-container)', color: '#FFFFFF' }
    }

    const baseStyle: any = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      ...sizeStyles[size],
      ...typeStyles[type]
    }

    return (
      <View style={baseStyle} onClick={disabled ? undefined : onClick}>
        <Text style={{ fontWeight: '600', textAlign: 'center', color: baseStyle.color }}>{text}</Text>
      </View>
    )
  }
}
