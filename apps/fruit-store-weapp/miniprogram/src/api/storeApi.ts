import { Store } from '../types';
import Taro from '@tarojs/taro';

const STORES_COLLECTION = 'stores';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export const storeApi = {
  async getStores(): Promise<ApiResponse<Store[]>> {
    try {
      const db = Taro.cloud.database({});
      const res: any = await db.collection(STORES_COLLECTION).where({ enabled: true }).get();
      const stores = (res.data || []).map((doc: any) => ({
        id: doc._id || doc.id,
        name: doc.name || '',
        address: doc.address || '',
        latitude: doc.latitude || doc.location?.latitude || 0,
        longitude: doc.longitude || doc.location?.longitude || 0,
        phone: doc.phone || '',
        imageUrl: doc.imageUrl || doc.images?.[0] || '',
      }));
      return { code: 0, message: 'success', data: stores, success: true };
    } catch (error) {
      console.error('[StoreApi] getStores failed:', error);
      return { code: -1, message: 'Failed to get stores', data: [], success: false };
    }
  },

  async getStoreById(id: string): Promise<ApiResponse<Store | null>> {
    try {
      const db = Taro.cloud.database({});
      const res: any = await db.collection(STORES_COLLECTION).doc(id).get();
      if (res.data) {
        const store: Store = {
          id: res.data._id || res.data.id,
          name: res.data.name || '',
          address: res.data.address || '',
          latitude: res.data.latitude || res.data.location?.latitude || 0,
          longitude: res.data.longitude || res.data.location?.longitude || 0,
          phone: res.data.phone || '',
          imageUrl: res.data.imageUrl || res.data.images?.[0] || '',
        };
        return { code: 0, message: 'success', data: store, success: true };
      }
      return { code: -1, message: 'Store not found', data: null, success: false };
    } catch (error) {
      console.error('[StoreApi] getStoreById failed:', error);
      return { code: -1, message: 'Failed to get store', data: null, success: false };
    }
  },
};

export default storeApi;