import {
  OrderStatus,
  OrderType,
  PaymentStatus,
  ServiceItem,
} from '../types';

export const ROUTES = {
  HOME: '/pages/home/index',
  ORDERS: '/pages/orders/index',
  RESERVATION: '/pages/reservation/index',
  PROFILE: '/pages/profile/index',
  PRODUCT_DETAIL: '/pages/product-detail/index',
  PAYMENT_SUCCESS: '/pages/payment-success/index',
  PAYMENT_FAIL: '/pages/payment-fail/index',
} as const;

export const CACHE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  CURRENT_STORE: 'current_store',
  ORDER_LIST: 'order_list',
  PRODUCT_LIST: 'product_list',
} as const;

export const ORDER_STATUS_CONFIG: Array<{
  value: OrderStatus;
  labelKey: string;
  color: string;
  tabIndex: number;
}> = [
  { value: 'ALL', labelKey: 'all', color: '#333333', tabIndex: 0 },
  { value: 'LOCKED', labelKey: 'locked', color: '#FF9800', tabIndex: 1 },
  { value: 'CANCELLED', labelKey: 'cancelled', color: '#999999', tabIndex: 2 },
  { value: 'COMPLETED', labelKey: 'completed', color: '#4CAF50', tabIndex: 3 },
];

export const ORDER_TYPE_CONFIG: Array<{
  value: OrderType;
  labelKey: string;
}> = [
  { value: 'direct', labelKey: 'direct' },
  { value: 'reservation', labelKey: 'reservationOrder' },
];

export const SERVICE_GRID_CONFIG: ServiceItem[] = [
  { icon: 'book', labelKey: 'littleGreenBook', pageUrl: '/pages/services/book/index', authRequired: true },
  { icon: 'checkin', labelKey: 'checkinRecord', pageUrl: '/pages/services/checkin/index', authRequired: true },
  { icon: 'review', labelKey: 'publishReview', pageUrl: '/pages/services/review/index', authRequired: true },
  { icon: 'comment', labelKey: 'commentRecord', pageUrl: '/pages/services/comments/index', authRequired: true },
  { icon: 'order-review', labelKey: 'orderReview', pageUrl: '/pages/services/order-review/index', authRequired: true },
  { icon: 'product', labelKey: 'productRecord', pageUrl: '/pages/services/products/index', authRequired: true },
  { icon: 'note', labelKey: 'noteRecord', pageUrl: '/pages/services/notes/index', authRequired: true },
  { icon: 'like', labelKey: 'myLikes', pageUrl: '/pages/services/likes/index', authRequired: true },
  { icon: 'appointment', labelKey: 'reservationRecord', pageUrl: '/pages/orders/index?type=reservation', authRequired: true },
];

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { labelKey: string; color: string }> = {
  PENDING: { labelKey: 'pendingPayment', color: '#FF9800' },
  SUCCESS: { labelKey: 'paymentSuccess', color: '#4CAF50' },
  FAILED: { labelKey: 'paymentFailed', color: '#F44336' },
  TIMEOUT: { labelKey: 'paymentTimeout', color: '#999999' },
};

export const TAB_BAR_CONFIG = [
  { key: 'home', labelKey: 'home', icon: 'home', activeIcon: 'home-active', path: '/pages/home/index' },
  { key: 'orders', labelKey: 'orders', icon: 'order', activeIcon: 'order-active', path: '/pages/orders/index' },
  { key: 'reservation', labelKey: 'reservation', icon: 'clock', activeIcon: 'clock-active', path: '/pages/reservation/index' },
  { key: 'profile', labelKey: 'profile', icon: 'user', activeIcon: 'user-active', path: '/pages/profile/index' },
];
