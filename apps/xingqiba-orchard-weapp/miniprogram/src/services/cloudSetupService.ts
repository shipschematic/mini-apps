import Taro from '@tarojs/taro';

const getDb = () => Taro.cloud.database({});

export const DB_COLLECTIONS = {
  PRODUCTS: 'products',
  ADMINS: 'admins',
  ORDERS: 'orders',
  STORES: 'stores',
};

export interface SetupResult {
  success: boolean;
  message: string;
  collectionsReady: boolean;
}

export const setupService = {
  async checkCollections(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    for (const name of Object.values(DB_COLLECTIONS)) {
      try {
        await getDb().collection(name).count();
        results[name] = true;
      } catch {
        results[name] = false;
      }
    }
    return results;
  },

  async setup(): Promise<SetupResult> {
    const collections = await this.checkCollections();
    const missing = Object.entries(collections)
      .filter(([, exists]) => !exists)
      .map(([name]) => name);

    if (missing.length > 0) {
      return {
        success: false,
        message: `Missing collections: ${missing.join(', ')}. Create them in CloudBase Console first.`,
        collectionsReady: false,
      };
    }

    await this.addInitialAdmin('admin', 'REMOVED_DEFAULT_PASSWORD', 'Administrator');
    return { success: true, message: 'All collections ready', collectionsReady: true };
  },

  async addInitialAdmin(username: string, password: string, name: string): Promise<boolean> {
    try {
      const res: any = await getDb().collection(DB_COLLECTIONS.ADMINS)
        .where({ username })
        .count();
      if (res.total > 0) return true;
      await getDb().collection(DB_COLLECTIONS.ADMINS).add({
        data: { username, password, name, role: 'admin', createdAt: Date.now() },
      });
      return true;
    } catch (error) {
      console.error('[Setup] addInitialAdmin failed:', error);
      return false;
    }
  },

  async seedSampleStores(): Promise<SetupResult> {
    try {
      const res: any = await getDb().collection(DB_COLLECTIONS.STORES).count();
      if (res.total > 0) return { success: true, message: 'Stores exist', collectionsReady: true };

      const stores = [{
        name: '黄陂园采摘基地',
        address: '武汉市黄陂区木兰山风景区',
        latitude: 31.12345,
        longitude: 114.12345,
        phone: '400-888-8888',
        imageUrl: '/assets/images/store.jpg',
        enabled: true,
        createdAt: Date.now(),
      }];

      for (const store of stores) {
        await getDb().collection(DB_COLLECTIONS.STORES).add({ data: store });
      }
      return { success: true, message: `Seeded ${stores.length} stores`, collectionsReady: true };
    } catch (error) {
      console.error('[Setup] seedSampleStores failed:', error);
      return { success: false, message: 'Failed to seed stores', collectionsReady: true };
    }
  },

  async seedSampleProducts(): Promise<SetupResult> {
    try {
      const res: any = await getDb().collection(DB_COLLECTIONS.PRODUCTS).count();
      if (res.total > 0) return { success: true, message: 'Products exist', collectionsReady: true };

      const products = [
        {
          title: '黄陂园【单人采摘套餐】1大人+外带1篮樱桃（约3斤）',
          imageUrl: '/assets/images/logo.png',
          price: 68,
          originalPrice: 128,
          soldCount: 326,
          storeId: 'store_001',
          tags: ['采摘', '亲子'],
          description: '单人采摘套餐，包含门票和外带樱桃',
          validityStart: '2026-04-01',
          validityEnd: '2026-06-30',
          rules: ['凭票入园', '请勿践踏果树', '具体价格以实际采摘重量为准'],
          content: [],
          enabled: true,
          createdAt: Date.now(),
        },
        {
          title: '黄陂园【亲子采摘套餐】2大1小+外带2篮樱桃（约6斤）',
          imageUrl: '/assets/images/logo.png',
          price: 128,
          originalPrice: 236,
          soldCount: 218,
          storeId: 'store_001',
          tags: ['采摘', '亲子'],
          description: '亲子采摘套餐，适合家庭出行',
          validityStart: '2026-04-01',
          validityEnd: '2026-06-30',
          rules: ['凭票入园', '请勿践踏果树'],
          content: [],
          enabled: true,
          createdAt: Date.now(),
        },
      ];

      for (const product of products) {
        await getDb().collection(DB_COLLECTIONS.PRODUCTS).add({ data: product });
      }
      return { success: true, message: `Seeded ${products.length} products`, collectionsReady: true };
    } catch (error) {
      console.error('[Setup] seedSampleProducts failed:', error);
      return { success: false, message: 'Failed to seed products', collectionsReady: true };
    }
  },
};

export default setupService;