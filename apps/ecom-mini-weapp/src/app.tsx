import React, { useEffect, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppShell } from './core/AppShell'
import './components/index'
import './app.scss'

interface AppProps {
  children: ReactNode
}

function App({ children }: AppProps) {
  useEffect(() => {
    // Initialize app on mount
    const init = async () => {
      try {
        // Load prompt-service config by default (can be switched to bookstore.json)
        await AppShell.loadLocalConfig(require('../public/config/prompt-service.json'))
        
        Taro.showToast({
          title: 'Welcome to ' + AppShell.getConfig().meta.appName,
          icon: 'none',
          duration: 2000
        })
      } catch (error) {
        Taro.showToast({
          title: 'Failed to load config',
          icon: 'error'
        })
      }
    }
    
    init()
  }, [])

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default App
