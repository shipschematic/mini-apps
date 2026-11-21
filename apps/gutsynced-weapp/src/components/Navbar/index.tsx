import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Icon from '../Icon'

interface NavbarProps {
  variant?: string
  title?: string
  showBack?: boolean
  showLogo?: boolean
  onBackClick?: () => void
  onTitleClick?: () => void
}

export default class Navbar extends Component<NavbarProps> {
  static defaultProps = {
    variant: 'home',
    showBack: false,
    showLogo: false
  }

  private getTitle(): string {
    const { variant, title } = this.props
    if (title) return title
    
    const titleMap: Record<string, string> = {
      home: 'Home',
      saved: 'Saved',
      'upload-recipe': 'Upload Recipe',
      collaboration: 'Collaboration',
      profile: 'Profile',
      search: 'Search'
    }
    return titleMap[variant || 'home'] || 'GutSynced'
  }

  render() {
    const { showBack, showLogo, onBackClick, onTitleClick } = this.props

    return (
      <View style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-outline)',
        height: '56px',
        padding: '0 16px'
      }}>
        <View style={{ display: 'flex', alignItems: 'center', minWidth: '60px' }}>
          {showBack && (
            <View onClick={onBackClick} style={{ padding: '8px' }}>
              <Icon name='back' size='medium' />
            </View>
          )}
          {showLogo && (
            <Text style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-primary)' }}>GutSynced</Text>
          )}
        </View>
        
        <View onClick={onTitleClick} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>{this.getTitle()}</Text>
        </View>
        
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '60px' }}>
          <View style={{ padding: '8px' }}>
            <Icon name='notification' size='medium' />
          </View>
        </View>
      </View>
    )
  }
}
