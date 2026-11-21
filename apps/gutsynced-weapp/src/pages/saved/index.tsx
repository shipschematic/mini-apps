import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { foodStore } from '../../utils/foodStore'
import { translate } from '../../config/i18n'
import './index.scss'

interface FavoritesState {
  tick: number
}

export default class FoodFavorites extends Component<{}, FavoritesState> {
  private unsubscribe?: () => void

  state: FavoritesState = { tick: 0 }

  componentDidMount() {
    this.unsubscribe = foodStore.subscribe(this.refresh)
    this.refresh()
  }

  componentDidShow() {
    this.refresh()
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refresh = () => {
    this.setState((state) => ({ tick: state.tick + 1 }))
    const label = translate(foodStore.currentLanguage, 'favorites')
    Taro.setNavigationBarTitle({
      title: `${label} (${foodStore.favoriteCount})`
    })
  }

  openDetail = (name: string) => {
    Taro.navigateTo({
      url: `/pages/food-detail/index?name=${encodeURIComponent(name)}`
    })
  }

  toggleFavorite = (name: string, event: any) => {
    event.stopPropagation()
    const item = foodStore.findByName(name)
    if (item) {
      foodStore.toggleFavorite(item)
    }
  }

  render() {
    const lang = foodStore.currentLanguage
    const t = (key: string) => translate(lang, key)
    const favorites = foodStore.getFavoriteItems()

    return (
      <View className='food-favorites'>
        {favorites.length === 0 ? (
          <View className='favorites-empty'>
            <Text className='favorites-empty-icon'>{'\u2661'}</Text>
            <Text className='favorites-empty-title'>{t('favorites_empty')}</Text>
            <Text className='favorites-empty-hint'>{t('favorites_empty_hint')}</Text>
          </View>
        ) : (
          <ScrollView className='favorites-list' scrollY>
            <View className='favorites-toolbar'>
              <Text className='favorites-summary'>
                {favorites.length} {t('favorites_count')}
              </Text>
              <View className='favorites-clear' onClick={() => foodStore.clearFavorites()}>
                <Text className='favorites-clear-text'>{t('clear_favorites')}</Text>
              </View>
            </View>
            {favorites.map((item) => (
              <View
                className='favorite-card'
                key={item.name}
                onClick={() => this.openDetail(item.name)}
              >
                <View
                  className='favorite-dot'
                  style={{ backgroundColor: item.status === 'green' ? '#4ADE80' : item.status === 'yellow' ? '#FBBF24' : '#F87171' }}
                />
                <View className='favorite-main'>
                  <Text className='favorite-name'>{item.name}</Text>
                  <Text className='favorite-category'>{item.category}</Text>
                </View>
                <Text
                  className='favorite-heart'
                  onClick={(event) => this.toggleFavorite(item.name, event)}
                >
                  {'\u2665'}
                </Text>
              </View>
            ))}
            <View className='favorites-spacer' />
          </ScrollView>
        )}
      </View>
    )
  }
}
