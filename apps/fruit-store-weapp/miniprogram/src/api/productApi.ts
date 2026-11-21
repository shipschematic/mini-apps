import { get } from './request';
import { ApiResponse, Product } from '../types';
import { cloudProductService } from '../services/cloudProductService';

export const getProducts = async (storeId?: string): Promise<ApiResponse<Product[]>> => {
  try {
    const products = await cloudProductService.getProducts(storeId);
    return { code: 0, message: 'success', data: products, success: true };
  } catch (error) {
    console.error('[ProductApi] getProducts failed:', error);
    return { code: 500, message: 'Failed to fetch products', data: [], success: false };
  }
};

export const getProductDetail = async (id: string): Promise<ApiResponse<Product | null>> => {
  try {
    const product = await cloudProductService.getProductById(id);
    return { code: 0, message: 'success', data: product, success: true };
  } catch (error) {
    console.error('[ProductApi] getProductDetail failed:', error);
    return { code: 500, message: 'Failed to fetch product', data: null, success: false };
  }
};

export const productApi = {
  async getProducts(storeId?: string): Promise<Product[]> {
    try {
      const res = await getProducts(storeId);
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getProductDetail(id: string): Promise<Product | null> {
    try {
      const res = await getProductDetail(id);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};