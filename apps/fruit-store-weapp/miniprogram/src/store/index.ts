import { create } from 'zustand';
import { User, Store as StoreType, Product, Order, ReservationForm, PaymentStatus } from '../types';
import { ActionTypes } from '../dispatcher/ActionTypes';
import { Language } from '../constants/i18n';
import { cloudProductService } from '../services/cloudProductService';
import { cloudOrderService } from '../services/cloudOrderService';
import { cloudService } from '../services/cloud/cloudService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface StoreState {
  currentStore: StoreType | null;
  storeList: StoreType[];
  loading: boolean;
}

interface ProductState {
  list: Product[];
  detail: Product | null;
  loading: boolean;
  error: string | null;
}

interface OrderState {
  directOrders: Order[];
  reservationOrders: Order[];
  activeFilter: {
    type: 'direct' | 'reservation' | 'ALL';
    status: 'ALL' | 'LOCKED' | 'CANCELLED' | 'COMPLETED';
  };
  loading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

interface ReservationState {
  formData: ReservationForm;
  submitting: boolean;
  errors: Record<string, string>;
}

interface PaymentState {
  status: PaymentStatus;
  currentOrderId: string | null;
  error: string | null;
}

interface UIState {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  loading: boolean;
  locale: Language;
}

export interface AppState {
  auth: AuthState;
  store: StoreState;
  product: ProductState;
  order: OrderState;
  reservation: ReservationState;
  payment: PaymentState;
  ui: UIState;
  setAuth: (auth: Partial<AuthState>) => void;
  setStore: (store: Partial<StoreState>) => void;
  setProduct: (product: Partial<ProductState>) => void;
  setOrder: (order: Partial<OrderState>) => void;
  setReservation: (reservation: Partial<ReservationState>) => void;
  setPayment: (payment: Partial<PaymentStatus>) => void;
  setUI: (ui: Partial<UIState>) => void;
  resetAuth: () => void;
}

type SetStateFunc = (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => Partial<AppState>;

const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: false,
    isAdmin: false,
  },
  store: {
    currentStore: null,
    storeList: [],
    loading: false,
  },
  product: {
    list: [],
    detail: null,
    loading: false,
    error: null,
  },
  order: {
    directOrders: [],
    reservationOrders: [],
    activeFilter: {
      type: 'ALL',
      status: 'ALL',
    },
    loading: false,
    pagination: {
      page: 1,
      pageSize: 10,
      hasMore: true,
    },
  },
  reservation: {
    formData: {
      storeId: '',
      storeName: '',
      userName: '',
      phone: '',
      appointmentDate: '',
      peopleCount: 1,
      remark: '',
    },
    submitting: false,
    errors: {},
  },
  payment: {
    status: 'PENDING',
    currentOrderId: null,
    error: null,
  },
  ui: {
    toast: null,
    loading: false,
    locale: 'zh',
  },
};

const rootReducer = (set: SetStateFunc) => ({
  ...initialState,
  setAuth: (auth: Partial<AuthState>) =>
    set((state) => ({ auth: { ...state.auth, ...auth } })),

  setStore: (store: Partial<StoreState>) =>
    set((state) => ({ store: { ...state.store, ...store } })),

  setProduct: (product: Partial<ProductState>) =>
    set((state) => ({ product: { ...state.product, ...product } })),

  setOrder: (order: Partial<OrderState>) =>
    set((state) => ({ order: { ...state.order, ...order } })),

  setReservation: (reservation: Partial<ReservationState>) =>
    set((state) => ({ reservation: { ...state.reservation, ...reservation } })),

  setPayment: (payment: Partial<PaymentState>) =>
    set((state) => ({ payment: { ...state.payment, ...payment } })),

  setUI: (ui: Partial<UIState>) =>
    set((state) => ({ ui: { ...state.ui, ...ui } })),

  resetAuth: () =>
    set(() => ({ auth: initialState.auth })),
});

export const useStore = create<AppState>()((set, get) => ({
  ...initialState,
  ...rootReducer(set),
}));

export const setAuth = (auth: Partial<AuthState>) => useStore.getState().setAuth(auth);
export const setStore = (store: Partial<StoreState>) => useStore.getState().setStore(store);
export const setProduct = (product: Partial<ProductState>) => useStore.getState().setProduct(product);
export const setOrder = (order: Partial<OrderState>) => useStore.getState().setOrder(order);
export const setReservation = (reservation: Partial<ReservationState>) => useStore.getState().setReservation(reservation);
export const setPayment = (payment: Partial<PaymentState>) => useStore.getState().setPayment(payment);
export const setUI = (ui: Partial<UIState>) => useStore.getState().setUI(ui);
export const resetAuth = () => useStore.getState().resetAuth();

export const dispatchAction = (action: { type: string; payload?: any }) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.AUTH_LOGIN:
      useStore.getState().setAuth({ isLoading: true, error: undefined });
      break;
    case ActionTypes.AUTH_LOGIN_SUCCESS:
      useStore.getState().setAuth({
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
        isLoading: false,
      });
      break;
    case ActionTypes.AUTH_LOGIN_FAILURE:
      useStore.getState().setAuth({
        isLoading: false,
        error: payload.error,
      });
      break;
    case ActionTypes.AUTH_LOGOUT:
      useStore.getState().resetAuth();
      break;
    case ActionTypes.PRODUCT_LIST_LOAD:
      useStore.getState().setProduct({ list: payload.products });
      break;
    case ActionTypes.PRODUCT_LOAD_FROM_CLOUD:
      const storeId = payload?.storeId;
      useStore.getState().setProduct({ loading: true, error: null });
      cloudProductService.getProducts(storeId).then((products) => {
        useStore.getState().setProduct({ list: products, loading: false });
      }).catch((error) => {
        console.error('[Store] loadProductsFromCloud failed:', error);
        useStore.getState().setProduct({ loading: false, error: 'Failed to load products' });
      });
      break;
    case ActionTypes.PRODUCT_DETAIL_LOAD:
      useStore.getState().setProduct({ detail: payload.product });
      break;
    case ActionTypes.PRODUCT_SET_LOADING:
      useStore.getState().setProduct({ loading: payload.loading });
      break;
    case ActionTypes.ORDER_LIST_LOAD:
      useStore.getState().setOrder({
        directOrders: payload.orders.filter((o: Order) => o.type === 'direct'),
        reservationOrders: payload.orders.filter((o: Order) => o.type === 'reservation'),
      });
      break;
    case ActionTypes.ORDER_LOAD_FROM_CLOUD:
      const userId = payload?.userId;
      useStore.getState().setOrder({ loading: true });
      cloudOrderService.getOrders(userId).then((orders) => {
        useStore.getState().setOrder({
          directOrders: orders.filter((o) => o.type === 'direct'),
          reservationOrders: orders.filter((o) => o.type === 'reservation'),
          loading: false,
        });
      }).catch((error) => {
        console.error('[Store] loadOrdersFromCloud failed:', error);
        useStore.getState().setOrder({ loading: false });
      });
      break;
    case ActionTypes.ORDER_CREATE:
      useStore.getState().setOrder({
        directOrders: [...useStore.getState().order.directOrders, payload.order],
      });
      break;
    case ActionTypes.ORDER_UPDATE_STATUS:
      const { orderId, status } = payload;
      const updateOrderInList = (orders: Order[]) =>
        orders.map((o) => (o.id === orderId ? { ...o, status } : o));
      useStore.getState().setOrder({
        directOrders: updateOrderInList(useStore.getState().order.directOrders),
        reservationOrders: updateOrderInList(useStore.getState().order.reservationOrders),
      });
      break;
    case ActionTypes.ORDER_SET_FILTER:
      useStore.getState().setOrder({
        activeFilter: { ...useStore.getState().order.activeFilter, ...payload.filter },
      });
      break;
    case ActionTypes.ORDER_DELETE:
      const deleteId = payload.orderId;
      useStore.getState().setOrder({
        directOrders: useStore.getState().order.directOrders.filter((o) => o.id !== deleteId),
        reservationOrders: useStore.getState().order.reservationOrders.filter((o) => o.id !== deleteId),
      });
      break;
    case ActionTypes.RESERVATION_UPDATE_FORM:
      useStore.getState().setReservation({
        formData: { ...useStore.getState().reservation.formData, ...payload },
      });
      break;
    case ActionTypes.RESERVATION_SUBMIT_START:
      useStore.getState().setReservation({ submitting: true });
      break;
    case ActionTypes.RESERVATION_SUBMIT_SUCCESS:
      useStore.getState().setReservation({ submitting: false });
      break;
    case ActionTypes.RESERVATION_SUBMIT_FAILURE:
      useStore.getState().setReservation({
        submitting: false,
        errors: payload.errors || {},
      });
      break;
    case ActionTypes.PAYMENT_START:
      useStore.getState().setPayment({
        status: 'PROCESSING',
        currentOrderId: payload.orderId,
        error: null,
      });
      break;
    case ActionTypes.PAYMENT_SUCCESS:
      useStore.getState().setPayment({
        status: 'SUCCESS',
        currentOrderId: payload.orderId,
      });
      break;
    case ActionTypes.PAYMENT_FAILURE:
      useStore.getState().setPayment({
        status: 'FAILED',
        error: payload.error,
      });
      break;
    case ActionTypes.PAYMENT_RESET:
      useStore.getState().setPayment({
        status: 'PENDING',
        currentOrderId: null,
        error: null,
      });
      break;
    case ActionTypes.UI_SHOW_TOAST:
      useStore.getState().setUI({ toast: payload });
      break;
    case ActionTypes.UI_HIDE_TOAST:
      useStore.getState().setUI({ toast: null });
      break;
    case ActionTypes.UI_SET_LOADING:
      useStore.getState().setUI({ loading: payload });
      break;
    default:
      break;
  }
};

export default useStore;