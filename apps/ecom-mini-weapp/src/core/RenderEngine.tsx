import { useEffect, useState, useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { PageConfig, PageContext, LayoutComponent } from './types'
import { ConfigParser } from './ConfigParser'
import { DataFetcher } from './DataFetcher'
import { ComponentRegistry } from './ComponentRegistry'
import { dispatch } from './ActionDispatcher'

interface RenderEngineProps {
  pageId: string
  params?: Record<string, any>
}

interface PageState {
  loading: boolean
  error: string | null
  data: any
  refreshing: boolean
  hasMore: boolean
}

/**
 * RenderEngine - Dynamic page renderer
 * Reads page config, fetches data, and renders components
 */

export function RenderEngine({ pageId, params = {} }: RenderEngineProps) {
  const [state, setState] = useState<PageState>({
    loading: true,
    error: null,
    data: null,
    refreshing: false,
    hasMore: true
  })

  const pageContext: PageContext = { pageId, params }

  // Get page configuration
  const pageConfig = ConfigParser.getPage(pageId)

  useEffect(() => {
    if (pageConfig) {
      loadPageData()
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Page "${pageId}" not found in config`
      }))
    }
  }, [pageId])

  /**
   * Load page data from configured source
   */
  const loadPageData = async () => {
    if (!pageConfig) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Data fetch timeout')), 5000)
      })

      const dataPromise = DataFetcher.fetch(pageConfig.dataSource, params)
      
      const data = await Promise.race([dataPromise, timeoutPromise])
      
      setState(prev => ({
        ...prev,
        loading: false,
        data
      }))
    } catch (error) {
      // Use fallback data if available
      if (pageConfig.dataSource?.type === 'static' && pageConfig.dataSource.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          data: pageConfig.dataSource.data
        }))
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }
  }

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async () => {
    setState(prev => ({ ...prev, refreshing: true }))
    await loadPageData()
    setState(prev => ({ ...prev, refreshing: false }))
  }

  /**
   * Handle load more for infinite scroll
   */
  const handleLoadMore = async () => {
    if (!state.hasMore || state.loading) return

    // Execute onLoadMore actions if defined
    if (pageConfig?.onLoadMore) {
      await dispatch(pageConfig.onLoadMore, pageContext)()
    }
  }

  /**
   * Render item using template component
   */
  const renderItem = useCallback((item: any, index: number) => {
    if (!pageConfig?.itemTemplate) {
      return null
    }

    const Component = ComponentRegistry.get(pageConfig.itemTemplate)
    
    if (!Component) {
      console.warn(`Component "${pageConfig.itemTemplate}" not found`)
      return null
    }

    const handleAction = async (actions: any[], context: any) => {
      await dispatch(actions, pageContext, { componentId: `${pageConfig.itemTemplate}-${index}`, ...context })()
    }

    return (
      <Component
        key={item.id || index}
        data={item}
        config={pageConfig}
        onAction={handleAction}
      />
    )
  }, [pageConfig, pageContext])

  /**
   * Render layout components for detail pages
   */
  const renderLayout = useCallback(() => {
    if (!pageConfig?.layout || !state.data) {
      return null
    }

    return pageConfig.layout.map((layout: LayoutComponent, index: number) => {
      const Component = ComponentRegistry.get(layout.component)
      
      if (!Component) {
        console.warn(`Layout component "${layout.component}" not found`)
        return null
      }

      const data = state.data[layout.prop]
      const config = layout.config || {}

      const handleAction = async (actions: any[], context: any) => {
        await dispatch(actions, pageContext, { componentId: `${layout.component}-${index}`, ...context })()
      }

      return (
        <Component
          key={`${layout.component}-${index}`}
          data={data}
          config={config}
          onAction={handleAction}
        />
      )
    })
  }, [pageConfig, state.data, pageContext])

  // Loading state
  if (state.loading) {
    return (
      <View className="render-engine loading">
        <View className="loading-spinner">Loading...</View>
      </View>
    )
  }

  // Error state
  if (state.error) {
    return (
      <View className="render-engine error">
        <View className="error-message">
          <View>Error: {state.error}</View>
          <View onClick={loadPageData} className="retry-button">Retry</View>
        </View>
      </View>
    )
  }

  // Render based on page type
  if (pageConfig?.type === 'detail') {
    return (
      <View className="render-engine detail">
        {renderLayout()}
      </View>
    )
  }

  // Grid/List view
  const items = Array.isArray(state.data) ? state.data : []
  const columns = pageConfig?.columns || 1

  return (
    <ScrollView
      className="render-engine grid"
      scrollY
      refresherEnabled
      refresherTriggered={state.refreshing}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={handleLoadMore}
    >
      <View className={`grid-container columns-${columns}`}>
        {items.map((item, index) => renderItem(item, index))}
      </View>
    </ScrollView>
  )
}
