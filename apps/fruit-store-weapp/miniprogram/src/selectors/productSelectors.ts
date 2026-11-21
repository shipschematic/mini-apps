import { useMemo } from 'react';
import { useStore } from '../store';
import { Product } from '../types';

export const selectProductsByStore = (products: Product[], storeId: string): Product[] => {
  return products.filter((product) => product.storeId === storeId);
};

export const selectProductPriceWithDiscount = (product: Product): { price: number; discount: number } => {
  const discount = product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  return { price: product.price, discount };
};

export const useProductSelectors = () => {
  const products = useStore((state) => state.product.list);
  const currentStore = useStore((state) => state.store.currentStore);

  const productsForCurrentStore = useMemo(
    () => (currentStore ? selectProductsByStore(products, currentStore.id) : products),
    [products, currentStore]
  );

  return {
    productsForCurrentStore,
  };
};
