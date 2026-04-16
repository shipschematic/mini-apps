import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { RenderEngine } from '../../core/RenderEngine'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const params = router.params || {}
  
  // The pageId is always 'detail' for this page
  // The product ID is passed as params.id
  const pageId = 'detail'

  return (
    <View className='detail-page'>
      <RenderEngine pageId={pageId} params={params} />
    </View>
  )
}
