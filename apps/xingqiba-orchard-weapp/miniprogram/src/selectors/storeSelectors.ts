import { useMemo } from 'react';
import { useStore } from '../store';
import { Store, Product } from '../types';

export const selectCurrentStoreWithProducts = (
  store: Store | null,
  products: Product[]
): { store: Store | null; products: Product[] } => {
  if (!store) return { store: null, products: [] };
  const storeProducts = products.filter((p) => p.storeId === store.id);
  return { store, products: storeProducts };
};

export const useStoreSelectors = () => {
  const currentStore = useStore((state) => state.store.currentStore);
  const storeList = useStore((state) => state.store.storeList);
  const products = useStore((state) => state.product.list);

  const storeWithProducts = useMemo(
    () => selectCurrentStoreWithProducts(currentStore, products),
    [currentStore, products]
  );

  return {
    currentStore: storeWithProducts.store,
    storeList,
    products: storeWithProducts.products,
  };
};
