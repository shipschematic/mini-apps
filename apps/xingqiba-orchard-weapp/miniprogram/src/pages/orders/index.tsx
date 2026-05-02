import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCallback, useEffect } from 'react';
import { useStore, dispatchAction } from '../../store';
import { useOrderSelectors } from '../../selectors';
import { OrderTypeToggle, OrderStatusTabs, OrderCard } from '../../components/business';
import { EmptyState, LoadingSpinner } from '../../components/common';
import { ORDER_TYPE_CONFIG, ORDER_STATUS_CONFIG, ROUTES } from '../../constants';
import { OrderType, OrderStatus, Order } from '../../types';
import { wxService, paymentService } from '../../services';
import { orderApi } from '../../api';
import { useI18n } from '../../hooks/useI18n';
import './index.scss';

function OrdersPage() {
  const orderType = useStore((state) => state.order.activeFilter.type);
  const orderStatus = useStore((state) => state.order.activeFilter.status);
  const loading = useStore((state) => state.order.loading);
  const { t } = useI18n();

  const {
    filteredDirectOrders,
    filteredReservationOrders,
  } = useOrderSelectors();

  const orders = orderType === 'direct' || orderType === 'ALL' ? filteredDirectOrders : filteredReservationOrders;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        dispatchAction({ type: 'ORDER_LOADING_START', payload: {} });
        const res = await Taro.cloud.callFunction({ name: 'xingqiba_getOrders', data: {} });
        if (res.result?.success && Array.isArray(res.result.data)) {
          const allOrders = res.result.data;
          dispatchAction({
            type: 'ORDER_SET_DIRECT_ORDERS',
            payload: { directOrders: allOrders }
          });
        }
      } catch (e) {
        console.error('[OrdersPage] Failed to load:', e);
      } finally {
        dispatchAction({ type: 'ORDER_LOADING_END', payload: {} });
      }
    };
    loadOrders();
  }, []);

  const handleTypeChange = (type: OrderType) => {
    dispatchAction({ type: 'ORDER_SET_FILTER', payload: { filter: { type } } });
  };

  const handleStatusChange = (status: OrderStatus) => {
    dispatchAction({ type: 'ORDER_SET_FILTER', payload: { filter: { status } } });
  };

  const handlePullDownRefresh = useCallback(async () => {
    wxService.showLoading();
    setTimeout(() => {
      wxService.hideLoading();
    }, 1000);
  }, []);

  const handlePay = async (order: Order) => {
    wxService.showLoading({ title: t('creating') });
    try {
      await paymentService.requestPayment(order.id);
    } catch (error) {
      wxService.showToast({ title: t('fail'), type: 'error' });
    } finally {
      wxService.hideLoading();
    }
  };

  const handleCancel = async (order: Order) => {
    const confirm = await wxService.showModal({
      content: t('confirm') + '?',
      confirmText: t('confirm'),
      cancelText: t('cancel'),
    });

    if (confirm) {
      wxService.showLoading();
      const success = await orderApi.cancelOrder(order.id);
      wxService.hideLoading();

      if (success) {
        dispatchAction({ type: 'ORDER_STATUS_UPDATE', payload: { orderId: order.id, status: 'CANCELLED' } });
        wxService.showToast({ title: t('cancelled'), type: 'success' });
      } else {
        wxService.showToast({ title: t('fail'), type: 'error' });
      }
    }
  };

  const handleDelete = async (order: Order) => {
    const confirm = await wxService.showModal({
      content: t('confirm') + '?',
      confirmText: t('confirm'),
      cancelText: t('cancel'),
    });

    if (confirm) {
      wxService.showLoading();
      const success = await orderApi.deleteOrder(order.id);
      wxService.hideLoading();

      if (success) {
        dispatchAction({ type: 'ORDER_DELETE', payload: { orderId: order.id } });
        wxService.showToast({ title: t('deleteOrder'), type: 'success' });
      } else {
        wxService.showToast({ title: t('fail'), type: 'error' });
      }
    }
  };

  const handleDetail = (order: Order) => {
    wxService.navigateTo(`${ROUTES.PRODUCT_DETAIL}?productId=${order.productId}`);
  };

  return (
    <View className="orders-page">
      <OrderTypeToggle
        types={ORDER_TYPE_CONFIG}
        active={orderType}
        onChange={handleTypeChange}
        t={t}
      />

      <OrderStatusTabs
        statuses={ORDER_STATUS_CONFIG}
        active={orderStatus}
        onChange={handleStatusChange}
        t={t}
      />

      <ScrollView
        className="orders-page__content"
        scrollY
        onPullDownRefresh={handlePullDownRefresh}
      >
        <View className="orders-page__content__inner">
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <EmptyState
            title={t('noOrders')}
            description={t('noOrdersDesc')}
            actionText={t('goShopping')}
            onAction={() => wxService.switchTab(ROUTES.HOME)}
            testid="orders-empty"
          />
        ) : (
          orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              onPay={handlePay}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onDetail={handleDetail}
              testid={`order-card-${index}`}
              t={t}
            />
          ))
        )}
        </View>
      </ScrollView>
    </View>
  );
}

export default OrdersPage;
