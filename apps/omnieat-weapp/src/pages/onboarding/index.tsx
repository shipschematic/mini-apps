import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface OnboardingState {
  currentIndex: number
}

const onboardingData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    title: 'Discover Recipes',
    description: 'Explore thousands of delicious recipes from around the world'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&h=400&fit=crop',
    title: 'Cook Together',
    description: 'Join live cooking sessions and collaborate with chefs'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=400&fit=crop',
    title: 'Share Your Creations',
    description: 'Upload your own recipes and inspire others'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    title: 'Track Your Progress',
    description: 'Keep track of your cooking journey and achievements'
  }
]

export default class Onboarding extends Component<{}, OnboardingState> {
  state: OnboardingState = {
    currentIndex: 0
  }

  componentDidShow() {
    console.log('=== [ONBOARDING] componentDidShow ===')
  }

  componentDidMount() {
    console.log('=== [ONBOARDING] componentDidMount ===')
  }

  handleNext = () => {
    if (this.state.currentIndex < onboardingData.length - 1) {
      this.setState({ currentIndex: this.state.currentIndex + 1 })
    } else {
      this.handleGetStarted()
    }
  }

  handleSkip = () => {
    this.handleGetStarted()
  }

  handleGetStarted = () => {
    Taro.setStorageSync('onboarding_completed', true)
    Taro.redirectTo({ url: '/pages/sign-in/index' })
  }

  render() {
    console.log('=== [ONBOARDING] render start ===')
    const { currentIndex } = this.state
    const item = onboardingData[currentIndex]

    return (
      <View className='onboarding'>
        <View className='onboarding__skip'>
          {currentIndex < onboardingData.length - 1 && (
            <Text className='onboarding__skip-text' onClick={this.handleSkip}>Skip</Text>
          )}
        </View>

        <View className='onboarding__slide'>
          <View className='onboarding__image-container'>
            <Image
              className='onboarding__image'
              src={item.image}
              mode='aspectFit'
            />
          </View>
          <View className='onboarding__text'>
            <Text className='onboarding__title'>{item.title}</Text>
            <Text className='onboarding__description'>{item.description}</Text>
          </View>
        </View>

        <View className='onboarding__dots'>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`onboarding__dot ${currentIndex === index ? 'onboarding__dot--active' : ''}`}
            />
          ))}
        </View>

        <View className='onboarding__actions'>
          <View
            className='onboarding__btn'
            onClick={this.handleNext}
          >
            <Text className='onboarding__btn-text'>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
