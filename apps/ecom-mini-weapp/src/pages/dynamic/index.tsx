import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { View } from '@tarojs/components'
import { RenderEngine } from '../../core/RenderEngine'
import { ConfigParser } from '../../core/ConfigParser'
import './index.scss'

/**
 * Dynamic Page - Single page that renders all content based on config
 * This is the only page in the Mini Program
 */

export default function DynamicPage() {
  const [pageId, setPageId] = useState<string>('home')
  const [params, setParams] = useState<Record<string, any>>({})

  useEffect(() => {
    // Get page ID from route params using getCurrentInstance
    const instance = getCurrentInstance()
    const routerParams = instance.router?.params || {}
    const id = (routerParams.id as string) || 'home'
    setPageId(id)
    setParams(routerParams as Record<string, any>)

    // Set navigation bar title from config
    const pageConfig = ConfigParser.getPage(id)
    if (pageConfig?.title) {
      Taro.setNavigationBarTitle({
        title: pageConfig.title
      })
    }
  }, [])

  return (
    <View className="dynamic-page">
      <RenderEngine pageId={pageId} params={params} />
    </View>
  )
}
