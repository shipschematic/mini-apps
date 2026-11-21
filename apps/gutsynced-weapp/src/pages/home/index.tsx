import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { foodStore } from '../../utils/foodStore'
import { translate, translateCategory } from '../../config/i18n'
import type { FoodStatus } from '../../models/food'
import './index.scss'

interface HomeState {
  tick: number
  expanded: Record<string, boolean>
}

const FILTERS: Array<{ value: FoodStatus | null; key: string; color: string }> = [
  { value: null, key: 'all_food', color: '#6750A4' },
  { value: 'green', key: 'green', color: '#4ADE80' },
  { value: 'yellow', key: 'yellow', color: '#FBBF24' },
  { value: 'red', key: 'red', color: '#F87171' }
]

export default class FoodHome extends Component<{}, HomeState> {
  private unsubscribe?: () => void

  state: HomeState = {
    tick: 0,
    expanded: {}
  }

  componentDidMount() {
    this.unsubscribe = foodStore.subscribe(this.refresh)
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  refresh = () => {
    this.setState((state) => ({ tick: state.tick + 1 }))
  }

  toggleCategory = (name: string) => {
    this.setState((state) => ({
      expanded: { ...state.expanded, [name]: !state.expanded[name] }
    }))
  }

  openDetail = (name: string) => {
    Taro.navigateTo({
      url: `/pages/food-detail/index?name=${encodeURIComponent(name)}`
    })
  }

  toggleLanguage = () => {
    foodStore.setLanguage(foodStore.currentLanguage === 'en' ? 'zh' : 'en')
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
    const categories = foodStore.getFilteredCategories()
    const activeFilter = foodStore.filter
    const { expanded } = this.state

    return (
      <View className='food-home'>
        <View className='diet-row'>
          <ScrollView className='diet-scroll' scrollX enableFlex>
            {foodStore.diets.map((diet) => (
              <View
                key={diet.id}
                className={`diet-chip ${foodStore.activeDiet.id === diet.id ? 'diet-chip--active' : ''}`}
                onClick={() => foodStore.switchDiet(diet.id)}
              >
                <Text className='diet-chip-text'>{diet.shortName}</Text>
              </View>
            ))}
          </ScrollView>
          <View className='lang-button' onClick={this.toggleLanguage}>
            <Text className='lang-text'>{lang === 'en' ? 'EN' : '中文'}</Text>
          </View>
        </View>

        <View className='search-wrap'>
          <Text className='search-icon'>{'\u2315'}</Text>
          <Input
            className='food-search'
            value={foodStore.query}
            placeholder={t('search_foods')}
            placeholderClass='food-search-placeholder'
            onInput={(event) => foodStore.setSearchQuery(event.detail.value)}
          />
          {foodStore.query ? (
            <Text className='search-clear' onClick={() => foodStore.setSearchQuery('')}>×</Text>
          ) : null}
        </View>

        <View className='favorites-row'>
          <Text className='favorites-heart'>{'\u2665'}</Text>
          <Text className='favorites-label'>{t('favorites')}</Text>
          <View
            className={`favorites-toggle ${foodStore.showFavoritesOnly ? 'favorites-toggle--on' : ''}`}
            onClick={() => foodStore.setFavoritesOnly(!foodStore.showFavoritesOnly)}
          >
            <View className='favorites-toggle-knob' />
          </View>
        </View>

        {foodStore.showFavoritesOnly && foodStore.hasFavorites ? (
          <View className='clear-row'>
            <View className='clear-chip' onClick={() => foodStore.clearFavorites()}>
              <Text className='clear-chip-text'>{t('clear_favorites')}</Text>
            </View>
          </View>
        ) : null}

        <ScrollView className='filter-scroll' scrollX enableFlex>
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.value
            return (
              <View
                key={filter.key}
                className={`filter-chip ${active ? 'filter-chip--active' : ''}`}
                style={active ? { borderColor: filter.color } : undefined}
                onClick={() => foodStore.setStatusFilter(active ? null : filter.value)}
              >
                <View className='filter-dot' style={{ backgroundColor: filter.color }} />
                <Text
                  className='filter-text'
                  style={active ? { color: filter.color } : undefined}
                >
                  {t(filter.key)}
                </Text>
              </View>
            )
          })}
        </ScrollView>

        <ScrollView className='food-list' scrollY>
          {categories.length === 0 ? (
            <View className='food-empty'>
              <View className='food-empty-circle'>
                <Text className='food-empty-icon'>{'\u2315'}</Text>
              </View>
              <Text className='food-empty-title'>{t('no_results')}</Text>
              <Text className='food-empty-hint'>{t('no_results_hint')}</Text>
            </View>
          ) : (
            categories.map((category) => {
              const isOpen = !!expanded[category.name]
              return (
                <View className='food-category' key={category.name}>
                  <View
                    className='food-category-header'
                    onClick={() => this.toggleCategory(category.name)}
                  >
                    <Text className='food-category-name'>
                      {translateCategory(lang, category.name)}
                    </Text>
                    <View className='food-count'>
                      <Text className='food-count-text'>{category.items.length}</Text>
                    </View>
                    <Text className='food-chevron'>{isOpen ? '\u25BE' : '\u25B8'}</Text>
                  </View>
                  {isOpen ? (
                    <View className='food-items'>
                      {category.items.map((item) => (
                        <View
                          className='food-item'
                          key={item.name}
                          onClick={() => this.openDetail(item.name)}
                        >
                          <View
                            className='food-status-dot'
                            style={{ backgroundColor: item.status === 'green' ? '#4ADE80' : item.status === 'yellow' ? '#FBBF24' : '#F87171' }}
                          />
                          <View className='food-item-main'>
                            <Text className='food-item-name'>{item.name}</Text>
                            {item.sidenote ? (
                              <Text className='food-item-note'>{item.sidenote}</Text>
                            ) : null}
                          </View>
                          <Text
                            className={`food-item-heart ${item.isFavorite ? 'food-item-heart--active' : ''}`}
                            onClick={(event) => this.toggleFavorite(item.name, event)}
                          >
                            {item.isFavorite ? '\u2665' : '\u2661'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              )
            })
          )}
          <View className='list-spacer' />
        </ScrollView>
      </View>
    )
  }
}
