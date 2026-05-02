import Taro from '@tarojs/taro';
import { Order } from '../types';

const ORDERS_COLLECTION = 'orders';

const getDb = () => Taro.cloud.database({});

const convertDbOrderToOrder = (doc: any): Order => ({
  id: doc._id || doc.id,
  orderNo: doc.orderNo || '',
  type: doc.type || 'direct',
  status: doc.status || 'LOCKED',
  productId: doc.productId || '',
  productSnapshot: doc.productSnapshot || {
    productId: '',
    title: '',
    imageUrl: '',
    price: 0,
    originalPrice: 0,
  },
  quantity: doc.quantity || 1,
  totalPrice: doc.totalPrice || 0,
  createTime: doc.createTime || new Date().toISOString(),
  userId: doc.userId || '',
  storeId: doc.storeId || '',
  phone: doc.phone || '',
  appointmentDate: doc.appointmentDate,
  appointmentPeople: doc.appointmentPeople,
  remark: doc.remark,
  payTime: doc.payTime,
}) as Order;

export const cloudOrderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      let query = getDb().collection(ORDERS_COLLECTION).where({ enabled: true });

      if (userId) {
        query = query.where({ userId, enabled: true });
      }

      const res: any = await (query as any).orderBy('createdAt', 'desc').get();
      return (res.data || []).map((doc: any) => convertDbOrderToOrder(doc));
    } catch (error) {
      console.error('[CloudOrderService] getOrders failed:', error);
      return [];
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const res: any = await (getDb().collection(ORDERS_COLLECTION).doc(id) as any).get();
      if (res.data) {
        return convertDbOrderToOrder(res.data);
      }
      return null;
    } catch (error) {
      console.error('[CloudOrderService] getOrderById failed:', error);
      return null;
    }
  },

  async createOrder(orderData: Partial<Order>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const orderNo = `DD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-6)}`;

      const dbOrder: any = {
        id: `order_${Date.now()}`,
        orderNo,
        type: orderData.type || 'direct',
        status: 'LOCKED',
        productId: orderData.productId || '',
        productSnapshot: orderData.productSnapshot || {},
        quantity: orderData.quantity || 1,
        totalPrice: orderData.totalPrice || 0,
        createTime: new Date().toISOString(),
        userId: orderData.userId || '',
        storeId: orderData.storeId || 'store_001',
        phone: orderData.phone || '',
        appointmentDate: orderData.appointmentDate,
        appointmentPeople: orderData.appointmentPeople,
        remark: orderData.remark,
        enabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const res: any = await getDb().collection(ORDERS_COLLECTION).add({ data: dbOrder });
      return { success: true, id: String(res._id) };
    } catch (error) {
      console.error('[CloudOrderService] createOrder failed:', error);
      return { success: false, error: 'Failed to create order' };
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const updates: any = {
        status,
        updatedAt: Date.now(),
      };

      if (status === 'COMPLETED') {
        updates.payTime = new Date().toISOString();
      }

      await getDb().collection(ORDERS_COLLECTION).doc(id).update({ data: updates });
      return { success: true };
    } catch (error) {
      console.error('[CloudOrderService] updateOrderStatus failed:', error);
      return { success: false, error: 'Failed to update order' };
    }
  },

  async cancelOrder(id: string): Promise<{ success: boolean; error?: string }> {
    return this.updateOrderStatus(id, 'CANCELLED');
  },

  async deleteOrder(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await getDb().collection(ORDERS_COLLECTION).doc(id).update({
        data: { enabled: false, updatedAt: Date.now() }
      });
      return { success: true };
    } catch (error) {
      console.error('[CloudOrderService] deleteOrder failed:', error);
      return { success: false, error: 'Failed to delete order' };
    }
  },
};

export default cloudOrderService;