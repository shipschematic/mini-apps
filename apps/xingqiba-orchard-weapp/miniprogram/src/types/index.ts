export interface User {
  openid: string;
  nickname: string;
  avatarUrl: string;
  phone?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  soldCount: number;
  storeId: string;
  tags: string[];
  description: string;
  validityStart: string;
  validityEnd: string;
  rules: ProductRule[];
  content: ProductContent[];
}

export interface ProductRule {
  label: string;
  value: string;
}

export interface ProductContent {
  name: string;
  count: string;
}

export interface Order {
  id: string;
  orderNo: string;
  type: OrderType;
  status: OrderStatus;
  productId: string;
  productSnapshot: ProductSnapshot;
  quantity: number;
  totalPrice: number;
  createTime: string;
  payTime?: string;
  userId: string;
  storeId: string;
  phone?: string;
  appointmentDate?: string;
  appointmentPeople?: number;
  remark?: string;
}

export interface ProductSnapshot {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
}

export type OrderType = 'direct' | 'reservation';

export type OrderStatus = 'ALL' | 'LOCKED' | 'CANCELLED' | 'COMPLETED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export interface ReservationForm {
  storeId: string;
  storeName: string;
  userName: string;
  phone: string;
  appointmentDate: string;
  peopleCount: number;
  remark: string;
}

export interface ServiceItem {
  icon: string;
  labelKey: string;
  pageUrl: string;
  badge?: number;
  authRequired: boolean;
}

export interface PaymentPayload {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: 'MD5' | 'HMAC-SHA256';
  paySign: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
