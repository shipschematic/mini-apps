import { Component } from 'react'
import { View, Text } from '@tarojs/components'

interface IconProps {
  name?: string
  size?: 'small' | 'medium' | 'large'
  color?: string
  onClick?: () => void
}

const iconUnicodeMap: Record<string, string> = {
  'back': '\u2190',
  'arrow': '\u2192',
  'search': '\u2315',
  'notification': '\u{1F514}',
  'language': '\u{1F310}',
  'moon': '\u{1F319}',
  'help': '\u{1F4AD}',
  'logout': '\u{1F6AA}',
  'calendar': '\u{1F4C5}',
  'plus': '+',
  'checklist': '\u2611',
  'home': '\u{1F3E0}',
  'collaboration': '\u{1F465}',
  'plus-in-box': '\u2295',
  'bookmark': '\u{1F516}',
  'profile': '\u{1F464}',
  'camera': '\u{1F4F7}',
  'trash': '\u{1F5D1}',
  'pencil': '\u270F',
  'comment': '\u{1F4AC}',
  'at': '@',
  'add-friends': '\u{1F465}',
  'google': 'G',
  'facebook': 'f',
  'apple': '\u{1F34E}',
  'eyes-open': '\u{1F441}',
  'eyes-close': '\u{1F441}\u200D\u{1F5E8}',
  'remove': '\u2212',
  'delete': '\u{1F5D1}',
  'outline-bookmark': '\u{1F516}',
  'receipt-tax': '\u{1F4B0}',
  'mail': '\u2709',
  'lock': '\u{1F512}',
  'user': '\u{1F464}',
  'dots-vertical': '\u22EE',
  'x': '\u2715',
  'star': '\u2B50',
  'credit-card': '\u{1F4B3}',
  'check': '\u2714',
  'edit': '\u270F',
  'file': '\u{1F4C4}',
  'heart': '\u2764',
  'outline-heart': '\u2661',
  'chevron-right': '\u232A',
  'share': '\u{1F4E4}',
  'info': '\u2139',
  'warning': '\u26A0',
  'link': '\u{1F517}'
}

export default class Icon extends Component<IconProps> {
  static defaultProps = {
    size: 'medium',
    color: '#212121'
  }

  render() {
    const { name = 'help', size = 'medium', color = '#212121', onClick } = this.props
    const iconChar = iconUnicodeMap[name] || '?'

    const sizeStyles: Record<string, any> = {
      small: { width: '32px', height: '32px', fontSize: '24px' },
      medium: { width: '48px', height: '48px', fontSize: '36px' },
      large: { width: '64px', height: '64px', fontSize: '48px' }
    }

    return (
      <View
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sizeStyles[size]
        }}
        onClick={onClick}
      >
        <Text style={{ lineHeight: 1, color }}>{iconChar}</Text>
      </View>
    )
  }
}
