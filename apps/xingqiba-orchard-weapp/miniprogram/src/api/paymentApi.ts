import Taro from '@tarojs/taro';
import { paymentService as paymentSvc } from '../services/payment/paymentService';
import { useStore } from '../store';
import { ROUTES } from '../constants';

export const paymentApi = {
  async requestPayment(orderId: string, totalFee: number = 0, body: string = 'Order Payment'): Promise<{ success: boolean; error?: string }> {
    try {
      useStore.getState().setPayment({ status: 'PENDING', currentOrderId: orderId, error: null });
      Taro.showLoading({ title: 'Creating order...' });

      const createRes: any = await Taro.cloud.callFunction({
        name: 'xingqiba_createPayment',
        data: { orderId, totalFee, body }
      });

      Taro.hideLoading();

      if (!createRes.result?.success || !createRes.result?.payment) {
        const errorMsg = createRes.result?.error || 'Failed to create payment order';
        useStore.getState().setPayment({ status: 'FAILED', error: errorMsg });
        return { success: false, error: errorMsg };
      }

      const paymentParams = createRes.result.payment;

      await Taro.requestPayment({
        timeStamp: paymentParams.timeStamp,
        nonceStr: paymentParams.nonceStr,
        package: paymentParams.package,
        signType: paymentParams.signType || 'MD5',
        paySign: paymentParams.paySign,
      });

      useStore.getState().setPayment({ status: 'SUCCESS' });

      const updateOrderInList = (orders: any[]) =>
        orders.map((o) => (o.id === orderId ? { ...o, status: 'COMPLETED', payTime: new Date().toISOString() } : o));

      useStore.getState().setOrder({
        directOrders: updateOrderInList(useStore.getState().order.directOrders),
        reservationOrders: updateOrderInList(useStore.getState().order.reservationOrders),
      });

      Taro.redirectTo({ url: `${ROUTES.PAYMENT_SUCCESS}?orderId=${orderId}` });
      return { success: true };
    } catch (error: any) {
      Taro.hideLoading();
      const errorMsg = error?.errMsg || error?.message || 'Payment failed';

      if (errorMsg.includes('cancel')) {
        useStore.getState().setPayment({ status: 'FAILED', error: 'User cancelled' });
        return { success: false, error: 'User cancelled' };
      }

      useStore.getState().setPayment({ status: 'FAILED', error: errorMsg });
      Taro.redirectTo({ url: `${ROUTES.PAYMENT_FAIL}?orderId=${orderId}&error=${encodeURIComponent(errorMsg)}` });
      return { success: false, error: errorMsg };
    }
  },

  async quickPurchase(product: {
    id: string;
    title: string;
    price: number;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const orderRes: any = await Taro.cloud.callFunction({
        name: 'xingqiba_createOrder',
        data: {
          items: [{
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
          }],
          total: product.price,
          discount: 0
        }
      });

      if (!orderRes.result?.success) {
        return { success: false, error: orderRes.result?.error || 'Failed to create order' };
      }

      const orderId = orderRes.result.orderId;
      const totalFee = Math.round(product.price * 100);
      return await this.requestPayment(orderId, totalFee, product.title);
    } catch (error: any) {
      return { success: false, error: error.message || 'Purchase failed' };
    }
  },

  async queryPaymentStatus(orderId: string): Promise<string> {
    try {
      const res: any = await Taro.cloud.callFunction({
        name: 'xingqiba_getOrders',
        data: { orderId }
      });
      const orders = res.result?.data || [];
      const order = orders.find((o: any) => o.id === orderId || o._id === orderId);
      return order?.status || 'PENDING';
    } catch {
      return 'PENDING';
    }
  },
};
