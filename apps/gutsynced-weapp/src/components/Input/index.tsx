import { Component } from 'react'
import { View, Text, Input as TaroInput } from '@tarojs/components'

interface CustomInputProps {
  type?: 'text' | 'search' | 'password' | 'number'
  state?: 'normal' | 'focus' | 'disable' | 'error'
  label?: string
  hasLabel?: boolean
  hintText?: string
  hasHint?: boolean
  error?: string
  leftIcon?: string
  rightIcon?: string
  placeholder?: string
  disabled?: boolean
  value?: string
  onInput?: (e: any) => void
  onChange?: (value: string) => void
}

export default class Input extends Component<CustomInputProps> {
  static defaultProps = {
    placeholder: 'Input form',
    hasLabel: false,
    hasHint: false
  }

  handleInput = (e: any) => {
    if (this.props.onInput) {
      this.props.onInput(e)
    }
  }

  render() {
    const {
      type = 'text',
      label,
      hasLabel = false,
      hintText,
      hasHint = false,
      error,
      leftIcon,
      rightIcon,
      placeholder,
      disabled,
      value,
      ...restProps
    } = this.props

    const baseStyle: any = {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: disabled ? 'var(--color-outline)' : error ? 'rgba(211,47,47,0.05)' : 'var(--color-background)',
      border: `2px solid ${error ? 'var(--color-danger)' : 'var(--color-outline)'}`,
      borderRadius: '12px',
      minHeight: '48px',
      padding: '0 16px'
    }

    return (
      <View style={{ width: '100%' }}>
        {hasLabel && label && (
          <View style={{ marginBottom: '4px' }}>
            <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>{label}</Text>
          </View>
        )}

        <View style={baseStyle}>
          {leftIcon && (
            <View style={{ marginRight: '8px' }}>
              <Text>{leftIcon}</Text>
            </View>
          )}

          <TaroInput
            style={{
              flex: 1,
              fontSize: '16px',
              color: 'var(--color-text)',
              height: '100%',
              padding: '8px 0'
            }}
            type={type}
            placeholder={placeholder}
            placeholderStyle={{ color: 'var(--color-muted)' }}
            disabled={disabled}
            value={value}
            onInput={this.handleInput}
            {...restProps}
          />

          {rightIcon && (
            <View style={{ marginLeft: '8px' }}>
              <Text>{rightIcon}</Text>
            </View>
          )}
        </View>

        {hasHint && hintText && (
          <View style={{ marginTop: '4px' }}>
            <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{hintText}</Text>
          </View>
        )}

        {error && (
          <View style={{ marginTop: '4px' }}>
            <Text style={{ fontSize: '12px', color: '#EF4444' }}>{error}</Text>
          </View>
        )}
      </View>
    )
  }
}
