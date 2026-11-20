import { Component, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

interface AppProps {
  children?: ReactNode
}

class App extends Component<AppProps> {
  constructor(props: AppProps) {
    super(props)
    console.log('=== [APP] constructor called ===')
  }

  componentDidMount() {
    console.log('=== [APP] componentDidMount ===')
  }

  componentDidShow() {
    console.log('=== [APP] componentDidShow ===')
    const onboardingCompleted = Taro.getStorageSync('onboarding_completed')
    if (!onboardingCompleted) {
      const pages = Taro.getCurrentPages()
      const currentPath = pages[pages.length - 1]?.route || ''
      if (!currentPath.includes('onboarding')) {
        Taro.redirectTo({ url: '/pages/onboarding/index' })
      }
    }
  }

  componentDidHide() {
    console.log('=== [APP] componentDidHide ===')
  }

  componentDidCatchError(err: string) {
    console.error('=== [APP] componentDidCatchError ===', err)
  }

  onPageNotFound(obj: any) {
    console.error('=== [APP] onPageNotFound ===', obj)
  }

  render() {
    console.log('=== [APP] render called, children:', !!this.props.children)
    return this.props.children
  }
}

export default App
