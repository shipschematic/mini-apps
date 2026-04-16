import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime'
import { View } from '@tarojs/components'
import { RenderEngine } from '../../core/RenderEngine'
import { ConfigParser } from '../../core/ConfigParser'

export default function CartPage() {
  const [pageId, setPageId] = useState<string>('cart')
  const [params, setParams] = useState<Record<string, any>>({})

  useEffect(() => {
    const instance = getCurrentInstance()
    const routerParams = instance.router?.params || {}
    setParams(routerParams as Record<string, any>)

    const pageConfig = ConfigParser.getPage('cart')
    if (pageConfig?.title) {
      Taro.setNavigationBarTitle({ title: pageConfig.title })
    }
  }, [])

  return (
    <View className="cart-page">
      <RenderEngine pageId="cart" params={params} />
    </View>
  )
}
