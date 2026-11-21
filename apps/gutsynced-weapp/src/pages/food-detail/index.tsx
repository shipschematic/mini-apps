import { Component } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { foodStore } from '../../utils/foodStore'
import { translate, translateCategory } from '../../config/i18n'
import { STATUS_COLORS } from '../../models/food'
import './index.scss'

interface DetailState {
  name: string
  tick: number
}

function readName(): string {
  const raw = Taro.getCurrentInstance().router?.params?.name || ''
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export default class FoodDetail extends Component<{}, DetailState> {
  private unsubscribe?: () => void

  state: DetailState = {
    name: readName(),
    tick: 0
  }

  componentDidMount() {
    this.unsubscribe = foodStore.subscribe(this.refresh)
    const item = foodStore.findByName(this.state.name)
    if (item) {
      Taro.setNavigationBarTitle({ title: item.name })
    }
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refresh = () => {
    this.setState((state) => ({ tick: state.tick + 1 }))
  }

  copyName = (name: string) => {
    Taro.setClipboardData({ data: name }).then(() => {
      Taro.showToast({
        title: translate(foodStore.currentLanguage, 'copied'),
        icon: 'none'
      })
    })
  }

  toggleFavorite = () => {
    const item = foodStore.findByName(this.state.name)
    if (item) {
      foodStore.toggleFavorite(item)
    }
  }

  render() {
    const lang = foodStore.currentLanguage
    const t = (key: string) => translate(lang, key)
    const item = foodStore.findByName(this.state.name)

    if (!item) {
      return (
        <View className='food-detail'>
          <View className='food-detail-empty'>
            <Text className='food-detail-empty-icon'>{'\u26A0'}</Text>
            <Text className='food-detail-empty-text'>{t('food_not_found')}</Text>
          </View>
        </View>
      )
    }

    const color = STATUS_COLORS[item.status]
    const statusLabel = foodStore.activeDiet.statusDescriptions[item.status]

    return (
      <View className='food-detail'>
        <ScrollView className='food-detail-scroll' scrollY>
          <View className='food-detail-hero'>
            <View
              className='food-detail-circle'
              style={{ borderColor: color, backgroundColor: `${color}26` }}
            >
              <Text className='food-detail-initial' style={{ color }}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className='food-detail-name'>{item.name}</Text>
            <Text className='food-detail-category'>
              {translateCategory(lang, item.category)}
            </Text>
          </View>

          <View className='food-detail-row'>
            <Text className='food-detail-label'>{t('category')}</Text>
            <Text className='food-detail-value'>{translateCategory(lang, item.category)}</Text>
          </View>

          <View className='food-detail-row'>
            <View className='food-detail-status'>
              <View className='food-detail-status-dot' style={{ backgroundColor: color }} />
              <Text className='food-detail-label'>{t('status')}</Text>
            </View>
            <Text className='food-detail-value' style={{ color }}>{statusLabel}</Text>
          </View>

          {item.sidenote ? (
            <View className='food-detail-note'>
              <Text className='food-detail-note-label'>{t('note')}</Text>
              <Text className='food-detail-note-text'>{item.sidenote}</Text>
            </View>
          ) : null}

          <View className='food-detail-actions'>
            <View className='food-detail-action' onClick={() => this.copyName(item.name)}>
              <Text className='food-detail-action-text'>{t('copy_name')}</Text>
            </View>
            <View
              className={`food-detail-favorite ${item.isFavorite ? 'food-detail-favorite--active' : ''}`}
              onClick={this.toggleFavorite}
            >
              <Text className='food-detail-favorite-text'>
                {item.isFavorite ? '\u2665' : '\u2661'}
              </Text>
            </View>
          </View>
          <View className='food-detail-spacer' />
        </ScrollView>
      </View>
    )
  }
}
