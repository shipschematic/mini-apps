import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

console.log('=== [THEME] module loaded ===')

interface Theme {
  id: string
  name: string
  preview: string
  primaryColor: string
  backgroundColor: string
}

const THEMES: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    preview: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop',
    primaryColor: '#FF5A5F',
    backgroundColor: '#FAFAFA'
  },
  {
    id: 'dark',
    name: 'Dark',
    preview: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=200&h=150&fit=crop',
    primaryColor: '#FF6B6B',
    backgroundColor: '#1A1A1A'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    preview: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=200&h=150&fit=crop',
    primaryColor: '#4A90E2',
    backgroundColor: '#F0F4F8'
  },
  {
    id: 'forest',
    name: 'Forest',
    preview: 'https://images.unsplash.com/photo-1556909114-3ea9f55a4f6f?w=200&h=150&fit=crop',
    primaryColor: '#5CB85C',
    backgroundColor: '#F5F9F5'
  }
]

interface ThemeScreenState {
  selectedTheme: string
}

export default class ThemeScreen extends Component<{}, ThemeScreenState> {
  state: ThemeScreenState = {
    selectedTheme: 'light'
  }

  componentDidMount() {
    console.log('=== [THEME] componentDidMount ===')
    const savedTheme = Taro.getStorageSync('app_theme')
    if (savedTheme) {
      this.setState({ selectedTheme: savedTheme })
    }
  }

  handleThemeSelect = (themeId: string) => {
    this.setState({ selectedTheme: themeId })
  }

  handleContinue = () => {
    Taro.setStorage({ key: 'app_theme', data: this.state.selectedTheme })
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/sign-in/index' })
    }, 100)
  }

  handleSkip = () => {
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/sign-in/index' })
    }, 100)
  }

  render() {
    console.log('=== [THEME] render start ===')
    const { selectedTheme } = this.state

    return (
      <View className='theme-screen'>
        <View className='theme-screen__header'>
          <Text className='theme-screen__title'>Choose Theme</Text>
          <Text className='theme-screen__subtitle'>
            Select a color theme that matches your style
          </Text>
        </View>

        <View className='theme-screen__themes-grid'>
          {THEMES.map((theme) => (
            <View
              key={theme.id}
              className={`theme-screen__theme-card ${
                selectedTheme === theme.id ? 'theme-screen__theme-card--selected' : ''
              }`}
              onClick={() => this.handleThemeSelect(theme.id)}
            >
              <View className='theme-screen__theme-preview'>
                <Image
                  className='theme-screen__theme-image'
                  src={theme.preview}
                  mode='aspectFill'
                />
                <View 
                  className='theme-screen__theme-overlay'
                  style={{ backgroundColor: theme.primaryColor }}
                />
              </View>
              <View className='theme-screen__theme-info'>
                <Text className='theme-screen__theme-name'>{theme.name}</Text>
                {selectedTheme === theme.id && (
                  <View className='theme-screen__theme-checkmark'>✓</View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className='theme-screen__actions'>
          <View className='theme-screen__btn theme-screen__btn--primary' onClick={this.handleContinue}>
            <Text className='theme-screen__btn-text'>Continue</Text>
          </View>
          <View className='theme-screen__btn theme-screen__btn--ghost' onClick={this.handleSkip}>
            <Text className='theme-screen__btn-text'>Skip</Text>
          </View>
        </View>
      </View>
    )
  }
}
