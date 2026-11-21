import Taro from '@tarojs/taro';
import { Order } from '../types';

const convertDbOrderToOrder = (doc: any): Order => ({
  id: doc._id || doc.id,
  orderNo: doc.orderNo || '',
  type: doc.type || 'direct',
  status: doc.status || doc.payment?.status || 'LOCKED',
  productId: doc.productId || '',
  productSnapshot: doc.productSnapshot || {
    productId: '',
    title: '',
    imageUrl: '',
    price: 0,
    originalPrice: 0,
  },
  quantity: doc.quantity || 1,
  totalPrice: doc.totalPrice || doc.total || 0,
  createTime: doc.createTime || new Date().toISOString(),
  userId: doc.userId || '',
  storeId: doc.storeId || '',
  phone: doc.phone || '',
  appointmentDate: doc.appointmentDate,
  appointmentPeople: doc.appointmentPeople,
  remark: doc.remark,
  payTime: doc.payTime,
}) as Order;

async function fetchOrders(): Promise<Order[]> {
  const res: any = await Taro.cloud.callFunction({
    name: 'xingqiba_getOrders',
    data: { limit: 100 },
  });

  if (!res.result?.success) {
    throw new Error(res.result?.error || 'Failed to fetch orders');
  }

  return (res.result.data || []).map((doc: any) => convertDbOrderToOrder(doc));
}

export const cloudOrderService = {
  async getOrders(_userId?: string): Promise<Order[]> {
    try {
      return await fetchOrders();
    } catch (error) {
      console.error('[CloudOrderService] getOrders failed:', error);
      return [];
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const orders = await fetchOrders();
      return orders.find((order) => order.id === id) || null;
    } catch (error) {
      console.error('[CloudOrderService] getOrderById failed:', error);
      return null;
    }
  },

  async createOrder(orderData: Partial<Order>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const orderNo = `DD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-6)}`;

      const dbOrder: any = {
        orderNo,
        type: orderData.type || 'direct',
        status: 'LOCKED',
        productId: orderData.productId || '',
        productSnapshot: orderData.productSnapshot || {},
        quantity: orderData.quantity || 1,
        totalPrice: orderData.totalPrice || 0,
        createTime: new Date().toISOString(),
        storeId: orderData.storeId || 'store_001',
        phone: orderData.phone || '',
        appointmentDate: orderData.appointmentDate,
        appointmentPeople: orderData.appointmentPeople,
        remark: orderData.remark,
        enabled: true,
      };

      const res: any = await Taro.cloud.callFunction({
        name: 'xingqiba_createOrder',
        data: { order: dbOrder },
      });

      if (!res.result?.success || !res.result.orderId) {
        return { success: false, error: res.result?.error || 'Failed to create order' };
      }

      return { success: true, id: String(res.result.orderId) };
    } catch (error) {
      console.error('[CloudOrderService] createOrder failed:', error);
      return { success: false, error: 'Failed to create order' };
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const res: any = await Taro.cloud.callFunction({
        name: 'xingqiba_updateOrderStatus',
        data: { orderId: id, status },
      });

      if (!res.result?.success) {
        return { success: false, error: res.result?.error || 'Failed to update order' };
      }

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
      const res: any = await Taro.cloud.callFunction({
        name: 'xingqiba_deleteOrder',
        data: { orderId: id },
      });

      if (!res.result?.success) {
        return { success: false, error: res.result?.error || 'Failed to delete order' };
      }

      return { success: true };
    } catch (error) {
      console.error('[CloudOrderService] deleteOrder failed:', error);
      return { success: false, error: 'Failed to delete order' };
    }
  },
};

export default cloudOrderService;
