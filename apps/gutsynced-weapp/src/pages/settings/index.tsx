import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { foodStore } from '../../utils/foodStore'
import { authStore } from '../../utils/authStore'
import { translate } from '../../config/i18n'
import './index.scss'

interface SettingsState {
  tick: number
  dietModal: boolean
}

export default class FoodSettings extends Component<{}, SettingsState> {
  private unsubscribeFood?: () => void
  private unsubscribeAuth?: () => void

  state: SettingsState = {
    tick: 0,
    dietModal: false
  }

  componentDidMount() {
    this.unsubscribeFood = foodStore.subscribe(this.refresh)
    this.unsubscribeAuth = authStore.subscribe(this.refresh)
  }

  componentWillUnmount() {
    this.unsubscribeFood?.()
    this.unsubscribeAuth?.()
  }

  refresh = () => {
    this.setState((state) => ({ tick: state.tick + 1 }))
  }

  openAuth = () => {
    Taro.navigateTo({ url: '/pages/food-auth/index' })
  }

  signOut = () => {
    authStore.signOut()
    Taro.showToast({ title: 'Signed out', icon: 'none' })
  }

  toggleLanguage = () => {
    foodStore.setLanguage(foodStore.currentLanguage === 'en' ? 'zh' : 'en')
  }

  selectDiet = (id: any) => {
    foodStore.switchDiet(id)
    this.setState({ dietModal: false })
  }

  render() {
    const lang = foodStore.currentLanguage
    const t = (key: string) => translate(lang, key)
    const diet = foodStore.activeDiet
    const authenticated = authStore.isAuthenticated

    return (
      <View className='gs-settings'>
        <ScrollView className='gs-settings-scroll' scrollY>
          <Text className='gs-section-title'>{t('account')}</Text>
          <View className='gs-card'>
            {authenticated ? (
              <View className='gs-row'>
                <View className='gs-row-main'>
                  <Text className='gs-row-title'>{t('signed_in_as')}</Text>
                  <Text className='gs-row-subtitle'>{authStore.userEmail}</Text>
                </View>
              </View>
            ) : (
              <View className='gs-row' onClick={this.openAuth}>
                <View className='gs-row-main'>
                  <Text className='gs-row-title'>{t('sign_in')}</Text>
                  <Text className='gs-row-subtitle'>{t('backup_favorites')}</Text>
                </View>
                <Text className='gs-row-chevron'>{'\u203A'}</Text>
              </View>
            )}
            {authenticated ? (
              <View className='gs-row gs-row--danger' onClick={this.signOut}>
                <Text className='gs-row-danger'>{t('sign_out')}</Text>
              </View>
            ) : null}
          </View>

          <Text className='gs-section-title'>{t('preferences')}</Text>
          <View className='gs-card'>
            <View className='gs-row' onClick={this.toggleLanguage}>
              <View className='gs-row-main'>
                <Text className='gs-row-title'>{t('language')}</Text>
                <Text className='gs-row-subtitle'>{lang === 'en' ? 'English' : '中文'}</Text>
              </View>
              <Text className='gs-row-value'>{lang === 'en' ? 'EN' : '中文'}</Text>
            </View>
            <View className='gs-row' onClick={() => this.setState({ dietModal: true })}>
              <View className='gs-row-main'>
                <Text className='gs-row-title'>{t('active_diet')}</Text>
                <Text className='gs-row-subtitle'>{diet.name}</Text>
              </View>
              <Text className='gs-row-value'>{diet.shortName}</Text>
              <Text className='gs-row-chevron'>{'\u203A'}</Text>
            </View>
          </View>

          <Text className='gs-section-title'>{t('about')}</Text>
          <View className='gs-card'>
            <View className='gs-row'>
              <View className='gs-row-main'>
                <Text className='gs-row-title'>{t('version')}</Text>
              </View>
              <Text className='gs-row-value'>2.0.0</Text>
            </View>
            <View className='gs-row'>
              <View className='gs-row-main'>
                <Text className='gs-row-title'>{t('data_source')}</Text>
              </View>
              <Text className='gs-row-value'>{t('local_cloud')}</Text>
            </View>
          </View>
          <View className='gs-settings-spacer' />
        </ScrollView>

        {this.state.dietModal ? (
          <View className='gs-modal-mask' onClick={() => this.setState({ dietModal: false })}>
            <View className='gs-modal' onClick={(event) => event.stopPropagation()}>
              <Text className='gs-modal-title'>{t('select_diet')}</Text>
              {foodStore.diets.map((item) => (
                <View
                  className={`gs-diet-option ${item.id === diet.id ? 'gs-diet-option--active' : ''}`}
                  key={item.id}
                  onClick={() => this.selectDiet(item.id)}
                >
                  <View className='gs-diet-main'>
                    <Text className='gs-diet-name'>{item.name}</Text>
                    <Text className='gs-diet-desc'>{item.description}</Text>
                  </View>
                  {item.id === diet.id ? (
                    <Text className='gs-diet-check'>{'\u2713'}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    )
  }
}
