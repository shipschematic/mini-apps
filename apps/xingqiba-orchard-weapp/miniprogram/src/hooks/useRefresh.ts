import { useCallback } from 'react';
import { useStore } from '../store';
import Taro from '@tarojs/taro';

export const useRefresh = (onRefresh?: () => void) => {
  const setStoreLoading = useStore((state) => state.setStore);
  const setProductLoading = useStore((state) => state.setProduct);
  const setOrderLoading = useStore((state) => state.setOrder);

  const onPullDownRefresh = useCallback(async () => {
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      Taro.stopPullDownRefresh();
    }
  }, [onRefresh]);

  return {
    onPullDownRefresh,
  };
};
