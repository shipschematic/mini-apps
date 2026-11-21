import { Component } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { favoriteStore } from '../../utils/favoriteStore'
import { request } from '../../utils/request'

export default class RecipeDetail extends Component<{}, { activeSection: 'overview' | 'ingredients' | 'steps'; showShare: boolean; isLiked: boolean; recipeId: string; recipe: any; loading: boolean }> {
  state = { activeSection: 'overview' as 'overview' | 'ingredients' | 'steps', showShare: false, isLiked: false, recipeId: '1', recipe: null as any, loading: true }
  private unsubscribe?: () => void

  async componentDidMount() {
    const id = (Taro.getCurrentInstance().router?.params?.id as string) || '1'
    
    // Subscribe to favorite store updates
    this.unsubscribe = favoriteStore.subscribe((ids) => {
      const isLiked = ids.includes(id)
      this.setState({ isLiked })
    })

    this.setState({ recipeId: id })
    await this.loadRecipe(id)
  }

  componentWillUnmount() {
    this.unsubscribe?.()
  }

  handleToggleLike = async () => {
    const { recipeId } = this.state
    try {
      await favoriteStore.toggle(recipeId)
    } catch (err: any) {
      Taro.showToast({ title: 'Failed to update', icon: 'none' })
    }
  }

  handleBack = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 1) {
      Taro.navigateBack()
    } else {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }

  handleShare = () => this.setState({ showShare: true })
  handleCloseShare = () => this.setState({ showShare: false })
  handleStartCooking = () => {
    const { recipeId } = this.state
    Taro.navigateTo({ url: `/pages/step-by-step/index?id=${recipeId}` })
  }

  loadRecipe = async (id: string) => {
    try {
      const recipe = await request({ url: `/api/recipes/${id}` })
      this.setState({ recipe, loading: false })
    } catch (err: any) {
      console.error('Failed to load recipe:', err)
      this.setState({ loading: false })
    }
  }

  render() {
    const { activeSection, showShare, isLiked, recipe, loading } = this.state

    if (loading) {
      return (
        <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px', color: 'var(--color-muted)' }}>Loading recipe...</Text>
        </View>
      )
    }

    if (!recipe) {
      return (
        <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px', color: 'var(--color-muted)' }}>Recipe not found</Text>
        </View>
      )
    }

    const ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : []
    const steps = recipe.steps ? JSON.parse(recipe.steps) : []

    return (
      <View style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        {/* Header */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', height: '56px', padding: '0 16px' }}>
          <Text style={{ fontSize: '24px', color: 'var(--color-text)' }} onClick={this.handleBack}>{'<'}</Text>
          <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>Recipe Detail</Text>
          <Text style={{ fontSize: '20px', color: isLiked ? 'var(--color-danger)' : 'var(--color-text)' }} onClick={this.handleToggleLike}>{'\u2764'}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} scrollY>
          {/* Image */}
          <View style={{ padding: '16px' }}>
            <Image src={recipe.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop'} mode='aspectFill' style={{ width: '100%', height: '280px', borderRadius: '20px' }} />
          </View>

          {/* Info */}
          <View style={{ padding: '0 16px 16px' }}>
            <Text style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '4px' }}>{recipe.category?.name || 'Recipe'}</Text>
            <Text style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>{recipe.title}</Text>

            <View style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Text style={{ fontSize: '14px' }}>{'\u23F1'}</Text>
                <Text style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{recipe.estimatedTime}</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Text style={{ fontSize: '14px' }}>{'\u2694'}</Text>
                <Text style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Medium</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Text style={{ fontSize: '14px' }}>{'\uD83D\uDD25'}</Text>
                <Text style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{recipe.quantity}</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Text style={{ fontSize: '14px', color: '#FBBF24' }}>{'\u2605'}</Text>
                <Text style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{recipe.rating || 0}</Text>
              </View>
            </View>

            {/* Author */}
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Image src={recipe.creator?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'} mode='aspectFill' style={{ width: '44px', height: '44px', borderRadius: '22px' }} />
                <View>
                  <Text style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{recipe.authorName || recipe.creator?.name}</Text>
                  <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{recipe.subtitle}</Text>
                </View>
              </View>
              <View style={{ padding: '8px 20px', backgroundColor: 'var(--color-primary-container)', borderRadius: '20px' }}>
                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Follow</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'var(--color-surface)', borderRadius: '12px', marginBottom: '16px' }}>
              {(['overview', 'ingredients', 'steps'] as const).map((section) => (
                <View key={section} style={{ flex: 1, alignItems: 'center', padding: '14px', borderBottom: activeSection === section ? '2px solid var(--color-primary)' : '2px solid transparent' }} onClick={() => this.setState({ activeSection: section })}>
                  <Text style={{ fontSize: '14px', fontWeight: activeSection === section ? '600' : '400', color: activeSection === section ? 'var(--color-primary)' : 'var(--color-muted)', textTransform: 'capitalize' }}>{section}</Text>
                </View>
              ))}
            </View>

            {/* Content */}
            <View style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '16px' }}>
              {activeSection === 'overview' && (
                <View>
                  <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Description</Text>
                  <Text style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: '22px' }}>{recipe.subtitle || 'No description available.'}</Text>
                </View>
              )}
              {activeSection === 'ingredients' && (
                <View>
                  <Text style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '12px' }}>Ingredients ({ingredients.length})</Text>
                  {ingredients.map((item: string, i: number) => (
                    <View key={i} style={{ display: 'flex', alignItems: 'center', paddingTop: '12px', paddingBottom: '12px', borderBottom: i < ingredients.length - 1 ? '1px solid var(--color-outline)' : 'none' }}>
                      <View style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <Text style={{ fontSize: '18px' }}>{'\uD83E\uDD69'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>{item}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {activeSection === 'steps' && (
                <View>
                  {steps.map((step: string, i: number) => (
                    <View key={i} style={{ display: 'flex', flexDirection: 'row', paddingTop: '12px', paddingBottom: '12px', borderBottom: i < steps.length - 1 ? '1px solid var(--color-outline)' : 'none' }}>
                      <View style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <Text style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>{i + 1}</Text>
                      </View>
                      <Text style={{ flex: 1, fontSize: '14px', color: 'var(--color-text)', lineHeight: '22px' }}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-outline)' }}>
          <View style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '16px', padding: '16px', alignItems: 'center' }} onClick={this.handleStartCooking}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '16px' }}>{"Let's Cook"}</Text>
          </View>
        </View>

        {/* Share Modal */}
        {showShare && (
          <View style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={this.handleCloseShare} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--color-surface)', borderRadius: '24px 24px 0 0', padding: '24px' }}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Text style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text)' }}>Share Recipe</Text>
                <Text style={{ fontSize: '20px', color: 'var(--color-muted)' }} onClick={this.handleCloseShare}>X</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                {[{ label: 'WeChat', color: '#07C160', icon: 'W' }, { label: 'Copy', color: '#1890FF', icon: 'L' }, { label: 'Friends', color: '#FA541C', icon: 'F' }].map((a) => (
                  <View key={a.label} style={{ alignItems: 'center' }}>
                    <View style={{ width: '56px', height: '56px', borderRadius: '28px', backgroundColor: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <Text style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold' }}>{a.icon}</Text>
                    </View>
                    <Text style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{a.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}