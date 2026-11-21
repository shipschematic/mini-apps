import { useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  pageSize?: number;
  onLoadMore?: (page: number) => Promise<boolean>;
}

export const useInfiniteScroll = (options: UseInfiniteScrollOptions = {}) => {
  const { pageSize = 10, onLoadMore } = options;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const success = onLoadMore ? await onLoadMore(nextPage) : true;
      if (success) {
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, onLoadMore]);

  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  return {
    page,
    hasMore,
    loading,
    loadMore,
    reset,
  };
};
