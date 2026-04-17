import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { RenderEngine } from '../../core/RenderEngine'
import { ConfigParser } from '../../core/ConfigParser'
import './index.scss'

/**
 * Dynamic Page - Single page that renders all content based on config
 */

export default function DynamicPage() {
  const [pageId, setPageId] = useState<string>('home')
  const [params, setParams] = useState<Record<string, any>>({})
  const dispatch = useDispatch()
  const pendingTabParams = useSelector((state: RootState) => state.storeConfig._pendingTabParams)

  useEffect(() => {
    let resolvedPageId = 'home'
    let resolvedParams: Record<string, any> = {}

    // Check for pending tab params (switchTab doesn't support query params)
    if (pendingTabParams) {
      resolvedPageId = pendingTabParams.target || 'home'
      resolvedParams = pendingTabParams.params || {}
      // Clear pending params
      dispatch({ type: 'storeConfig/update', payload: { _pendingTabParams: undefined } })
    } else {
      // Get page ID from route params using getCurrentInstance
      const instance = getCurrentInstance()
      const routerParams = instance.router?.params || {}
      resolvedPageId = (routerParams.id as string) || 'home'
      resolvedParams = routerParams as Record<string, any>
    }

    setPageId(resolvedPageId)
    setParams(resolvedParams)

    // Set navigation bar title from config
    const pageConfig = ConfigParser.getPage(resolvedPageId)
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
