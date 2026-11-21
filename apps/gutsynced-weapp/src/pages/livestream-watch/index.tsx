import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface LivestreamWatchState {
  livestream: any
  isLive: boolean
  viewerCount: number
  comments: any[]
}

export default class LivestreamWatch extends Component<{}, LivestreamWatchState> {
  state: LivestreamWatchState = {
    livestream: null,
    isLive: false,
    viewerCount: 0,
    comments: []
  }

  componentDidMount = async () => {
    await this.loadLivestream()
  }

  loadLivestream = async () => {
    try {
      const router = Taro.getCurrentInstance().router
      const id = router?.params?.id

      if (!id) {
        Taro.showToast({ title: 'Livestream ID required', icon: 'none' })
        return
      }

      const livestream = {
        id,
        title: 'Cooking Thai Green Curry',
        streamUrl: '',
        thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=670&h=360&fit=crop',
        host: {
          name: 'Chef Guest',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
        },
        viewers: 1234,
        likes: 567,
        isLive: true
      }

      this.setState({
        livestream,
        isLive: livestream.isLive,
        viewerCount: livestream.viewers
      })
    } catch (error: any) {
      Taro.showToast({ title: 'Failed to load livestream', icon: 'none' })
    }
  }

  handleLike = () => {
    Taro.showToast({ title: 'Liked!', icon: 'success' })
  }

  handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    })
  }

  handleComment = () => {
    Taro.showToast({ title: 'Comment feature coming soon', icon: 'none' })
  }

  render() {
    const { livestream, isLive, viewerCount } = this.state

    if (!livestream) {
      return (
        <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
          <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
            <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Livestream</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Text>Loading...</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <View style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline)' }}>
          <Text style={{ fontSize: '18px', marginRight: '12px' }} onClick={() => Taro.navigateBack()}>&larr;</Text>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>Livestream</Text>
        </View>

        <View style={{ position: 'relative' }}>
          <Image
            src={livestream.thumbnail}
            mode='aspectFill'
            style={{ width: '100%', height: '300px' }}
          />

          {isLive && (
            <View style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#EF4444', padding: '4px 8px', borderRadius: '4px' }}>
              <Text style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>LIVE</Text>
            </View>
          )}

          <View style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>
            <Text style={{ color: '#fff', fontSize: '12px', marginRight: '4px' }}>&#128101;</Text>
            <Text style={{ color: '#fff', fontSize: '12px' }}>{viewerCount}</Text>
          </View>
        </View>

        <View style={{ padding: '16px', backgroundColor: 'var(--color-surface)', marginBottom: '8px' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>{livestream.title}</Text>

          <View style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Image
              src={livestream.host.avatar}
              mode='aspectFill'
              style={{ width: '48px', height: '48px', borderRadius: '24px', marginRight: '12px' }}
            />
            <Text style={{ fontSize: '16px' }}>{livestream.host.name}</Text>
          </View>

          <View style={{ display: 'flex', gap: '12px' }}>
            <View onClick={this.handleLike} style={{ flex: 1, backgroundColor: 'var(--color-primary-container)', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>&#10084; Like</Text>
            </View>
            <View onClick={this.handleComment} style={{ flex: 1, backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid var(--color-outline)' }}>
              <Text style={{ fontSize: '14px' }}>&#128172; Comment</Text>
            </View>
            <View onClick={this.handleShare} style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', alignItems: 'center', border: '1px solid var(--color-outline)' }}>
              <Text style={{ fontSize: '14px' }}>&#10148;</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
