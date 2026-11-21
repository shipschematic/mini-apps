import Taro from '@tarojs/taro';
import { paymentApi } from '../../api/paymentApi';
import { useStore } from '../../store';
import { ROUTES } from '../../constants';

export const paymentService = {
  async requestPayment(orderId: string): Promise<{ success: boolean; error?: string }> {
    return await paymentApi.requestPayment(orderId);
  },

  async quickPurchase(product: {
    id: string;
    title: string;
    price: number;
  }): Promise<{ success: boolean; error?: string }> {
    return await paymentApi.quickPurchase(product);
  },

  async queryStatus(orderId: string): Promise<boolean> {
    const status = await paymentApi.queryPaymentStatus(orderId);
    return status === 'COMPLETED' || status === 'PAID';
  },

  handlePaymentSuccess(orderId: string): void {
    useStore.getState().setPayment({ status: 'SUCCESS' });
    Taro.redirectTo({ url: `${ROUTES.PAYMENT_SUCCESS}?orderId=${orderId}` });
  },

  handlePaymentFail(orderId: string, error: string): void {
    useStore.getState().setPayment({ status: 'FAILED', error });
    Taro.redirectTo({ url: `${ROUTES.PAYMENT_FAIL}?orderId=${orderId}&error=${encodeURIComponent(error)}` });
  },
};
