import React, { useEffect, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppShell } from './core/AppShell'
import './app.scss'

interface AppProps {
  children: ReactNode
}

function App({ children }: AppProps) {
  useEffect(() => {
    const init = async () => {
      try {
        await AppShell.loadLocalConfig(require('../public/config/prompt-service.json'))
        const config = AppShell.getConfigSafe()
        Taro.showToast({
          title: 'Welcome to ' + (config?.meta?.appName || 'App'),
          icon: 'none',
          duration: 2000
        })
      } catch (_) {
        Taro.showToast({ title: 'Failed to load config', icon: 'error' })
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
