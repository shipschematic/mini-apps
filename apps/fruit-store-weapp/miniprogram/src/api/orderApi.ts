import { get, post } from './request';
import { ApiResponse, Order, PaginatedResponse } from '../types';
import { cloudOrderService } from '../services/cloudOrderService';

export const createOrder = async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
  try {
    const result = await cloudOrderService.createOrder(orderData);

    if (result.success && result.id) {
      const order = await cloudOrderService.getOrderById(result.id);
      if (order) {
        return { code: 0, message: 'success', data: order, success: true };
      }
    }

    return { code: 500, message: result.error || 'Failed to create order', data: null as any, success: false };
  } catch (error) {
    console.error('[OrderApi] createOrder failed:', error);
    return { code: 500, message: 'Failed to create order', data: null as any, success: false };
  }
};

export const getOrders = async (userId?: string): Promise<ApiResponse<Order[]>> => {
  try {
    const orders = await cloudOrderService.getOrders(userId);
    return { code: 0, message: 'success', data: orders, success: true };
  } catch (error) {
    console.error('[OrderApi] getOrders failed:', error);
    return { code: 500, message: 'Failed to fetch orders', data: [], success: false };
  }
};

export const getOrderDetail = async (id: string): Promise<ApiResponse<Order | null>> => {
  try {
    const order = await cloudOrderService.getOrderById(id);
    return { code: 0, message: 'success', data: order, success: true };
  } catch (error) {
    console.error('[OrderApi] getOrderDetail failed:', error);
    return { code: 500, message: 'Failed to fetch order', data: null, success: false };
  }
};

export const cancelOrder = async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const result = await cloudOrderService.cancelOrder(id);
    return { code: 0, message: 'success', data: { success: result.success }, success: true };
  } catch (error) {
    console.error('[OrderApi] cancelOrder failed:', error);
    return { code: 500, message: 'Failed to cancel order', data: { success: false }, success: false };
  }
};

export const deleteOrder = async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    const result = await cloudOrderService.deleteOrder(id);
    return { code: 0, message: 'success', data: { success: result.success }, success: true };
  } catch (error) {
    console.error('[OrderApi] deleteOrder failed:', error);
    return { code: 500, message: 'Failed to delete order', data: { success: false }, success: false };
  }
};

export const orderApi = {
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      const res = await createOrder(orderData);
      return res.data;
    } catch {
      return null;
    }
  },

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const res = await getOrders(userId);
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getOrderDetail(id: string): Promise<Order | null> {
    try {
      const res = await getOrderDetail(id);
      return res.data;
    } catch {
      return null;
    }
  },

  async cancelOrder(id: string): Promise<boolean> {
    try {
      const res = await cancelOrder(id);
      return res.success && res.data?.success;
    } catch {
      return false;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const res = await deleteOrder(id);
      return res.success && res.data?.success;
    } catch {
      return false;
    }
  },
};