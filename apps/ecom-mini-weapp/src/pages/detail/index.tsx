import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { RenderEngine } from '../../core/RenderEngine'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const params = router.params || {}
  
  // Support pageId override for non-detail pages (e.g. library)
  // Default to 'detail' for product detail view
  const pageId = (params.pageId as string) || 'detail'

  return (
    <View className='detail-page'>
      <RenderEngine pageId={pageId} params={params} />
    </View>
  )
}
