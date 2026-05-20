import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

console.log('=== [LANGUAGE] module loaded ===')

interface Language {
  id: string
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { id: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' }
]

interface LanguageScreenState {
  selectedLanguage: string
}

export default class LanguageScreen extends Component<{}, LanguageScreenState> {
  state: LanguageScreenState = {
    selectedLanguage: 'en'
  }

  componentDidMount() {
    console.log('=== [LANGUAGE] componentDidMount ===')
    const savedLanguage = Taro.getStorageSync('app_language')
    if (savedLanguage) {
      this.setState({ selectedLanguage: savedLanguage })
    }
  }

  handleLanguageSelect = (languageId: string) => {
    this.setState({ selectedLanguage: languageId })
  }

  handleContinue = () => {
    Taro.setStorage({ key: 'app_language', data: this.state.selectedLanguage })
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/theme/index' })
    }, 100)
  }

  handleSkip = () => {
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/theme/index' })
    }, 100)
  }

  render() {
    console.log('=== [LANGUAGE] render start ===')
    const { selectedLanguage } = this.state

    return (
      <View className='language-screen'>
        <View className='language-screen__header'>
          <Text className='language-screen__title'>Select Language</Text>
          <Text className='language-screen__subtitle'>
            Choose your preferred language
          </Text>
        </View>

        <ScrollView className='language-screen__list' scrollY>
          {LANGUAGES.map((language) => (
            <View
              key={language.id}
              className={`language-screen__item ${
                selectedLanguage === language.id ? 'language-screen__item--selected' : ''
              }`}
              onClick={() => this.handleLanguageSelect(language.id)}
            >
              <View className='language-screen__language-info'>
                <Text className='language-screen__flag'>{language.flag}</Text>
                <View className='language-screen__language-texts'>
                  <Text className='language-screen__language-name'>{language.name}</Text>
                  <Text className='language-screen__language-native'>{language.nativeName}</Text>
                </View>
              </View>
              {selectedLanguage === language.id && (
                <View className='language-screen__checkmark'>✓</View>
              )}
            </View>
          ))}
        </ScrollView>

        <View className='language-screen__actions'>
          <View className='language-screen__btn language-screen__btn--primary' onClick={this.handleContinue}>
            <Text className='language-screen__btn-text'>Continue</Text>
          </View>
          <View className='language-screen__btn language-screen__btn--ghost' onClick={this.handleSkip}>
            <Text className='language-screen__btn-text'>Skip</Text>
          </View>
        </View>
      </View>
    )
  }
}
