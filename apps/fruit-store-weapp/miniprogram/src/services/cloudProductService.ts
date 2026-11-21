import Taro from '@tarojs/taro';
import { Product } from '../types';
import { cloudService } from './cloud/cloudService';

const PRODUCTS_COLLECTION = 'products';

const getDb = () => Taro.cloud.database({});

const convertDbProductToProduct = (doc: any): Product => ({
  id: doc._id || doc.id,
  title: doc.title || '',
  imageUrl: doc.imageUrl || '/assets/images/logo.png',
  price: doc.price || 0,
  originalPrice: doc.originalPrice || 0,
  soldCount: doc.soldCount || 0,
  storeId: doc.storeId || '',
  tags: doc.tags || [],
  description: doc.description || '',
  validityStart: doc.validityStart || '',
  validityEnd: doc.validityEnd || '',
  rules: doc.rules || [],
  content: doc.content || [],
});

const convertProductToDbProduct = (product: Omit<Product, 'id'> & { id?: string }): any => ({
  id: product.id || `prod_${Date.now()}`,
  title: product.title,
  imageUrl: product.imageUrl,
  price: product.price,
  originalPrice: product.originalPrice,
  soldCount: product.soldCount,
  storeId: product.storeId,
  tags: product.tags,
  description: product.description,
  validityStart: product.validityStart,
  validityEnd: product.validityEnd,
  rules: product.rules,
  content: product.content,
  enabled: true,
  updatedAt: Date.now(),
});

export const cloudProductService = {
  async getProducts(storeId?: string): Promise<Product[]> {
    if (!cloudService.isReady()) {
      console.warn('[CloudProductService] CloudBase not ready');
      return [];
    }

    try {
      let query = getDb().collection(PRODUCTS_COLLECTION).where({ enabled: true });

      if (storeId) {
        query = query.where({ storeId, enabled: true });
      }

      const res: any = await (query as any).orderBy('createdAt', 'desc').get();
      return (res.data || []).map((doc: any) => convertDbProductToProduct(doc));
    } catch (error) {
      console.error('[CloudProductService] getProducts failed:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    if (!cloudService.isReady()) {
      console.warn('[CloudProductService] CloudBase not ready');
      return null;
    }

    try {
      const res: any = await (getDb().collection(PRODUCTS_COLLECTION).doc(id) as any).get();
      if (res.data) {
        return convertDbProductToProduct(res.data);
      }
      return null;
    } catch (error) {
      console.error('[CloudProductService] getProductById failed:', error);
      return null;
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!cloudService.isReady()) {
      return { success: false, error: 'CloudBase not initialized' };
    }

    try {
      const dbProduct: any = {
        ...convertProductToDbProduct(product),
        createdAt: Date.now(),
      };

      const res: any = await getDb().collection(PRODUCTS_COLLECTION).add({ data: dbProduct });
      return { success: true, id: String(res._id) };
    } catch (error) {
      console.error('[CloudProductService] addProduct failed:', error);
      return { success: false, error: 'Failed to add product' };
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> {
    if (!cloudService.isReady()) {
      return { success: false, error: 'CloudBase not initialized' };
    }

    try {
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.imageUrl) dbUpdates.imageUrl = updates.imageUrl;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.originalPrice = updates.originalPrice;
      if (updates.soldCount !== undefined) dbUpdates.soldCount = updates.soldCount;
      if (updates.storeId) dbUpdates.storeId = updates.storeId;
      if (updates.tags) dbUpdates.tags = updates.tags;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.validityStart) dbUpdates.validityStart = updates.validityStart;
      if (updates.validityEnd) dbUpdates.validityEnd = updates.validityEnd;
      if (updates.rules) dbUpdates.rules = updates.rules;
      if (updates.content) dbUpdates.content = updates.content;
      dbUpdates.updatedAt = Date.now();

      await getDb().collection(PRODUCTS_COLLECTION).doc(id).update({ data: dbUpdates });
      return { success: true };
    } catch (error) {
      console.error('[CloudProductService] updateProduct failed:', error);
      return { success: false, error: 'Failed to update product' };
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    if (!cloudService.isReady()) {
      return { success: false, error: 'CloudBase not initialized' };
    }

    try {
      await getDb().collection(PRODUCTS_COLLECTION).doc(id).update({ data: { enabled: false, updatedAt: Date.now() } });
      return { success: true };
    } catch (error) {
      console.error('[CloudProductService] deleteProduct failed:', error);
      return { success: false, error: 'Failed to delete product' };
    }
  },

  async uploadProductImage(filePath: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const ext = filePath.split('.').pop() || 'jpg';
      const cloudPath = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

      const uploadRes: any = await Taro.cloud.uploadFile({
        cloudPath,
        filePath,
      });

      if (uploadRes.fileID) {
        return { success: true, url: uploadRes.fileID };
      }
      return { success: false, error: 'Upload failed' };
    } catch (error) {
      console.error('[CloudProductService] uploadProductImage failed:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  },

  async getImageUrl(fileId: string): Promise<string> {
    if (fileId.startsWith('cloud://')) {
      try {
        const res: any = await Taro.cloud.getTempFileURL({ fileList: [fileId] });
        if (res.fileList && res.fileList[0]?.tempFileURL) {
          return res.fileList[0].tempFileURL;
        }
      } catch (error) {
        console.error('[CloudProductService] getImageUrl failed:', error);
      }
    }
    return fileId;
  },
};

export default cloudProductService;