import { ActionTypes, AppAction } from './ActionTypes';

type ActionCreator<T = undefined> = (payload?: T) => { type: string; payload?: T };

export const appInit = (): AppAction => ({ type: ActionTypes.APP_INIT });

export const login = (code: string) => ({ type: ActionTypes.AUTH_LOGIN, payload: { code } });
export const logout = (): AppAction => ({ type: ActionTypes.AUTH_LOGOUT });
export const setUser = (user: any) => ({ type: ActionTypes.AUTH_SET_USER, payload: { user } });
export const setToken = (token: string) => ({ type: ActionTypes.AUTH_SET_TOKEN, payload: { token } });
export const checkSession = () => ({ type: ActionTypes.AUTH_CHECK_SESSION });

export const selectStore = (storeId: string) => ({ type: ActionTypes.STORE_SELECT, payload: { storeId } });
export const loadStores = (stores: any[]) => ({ type: ActionTypes.STORE_LIST_LOAD, payload: { stores } });
export const setStoreLoading = (loading: boolean) => ({ type: ActionTypes.STORE_SET_LOADING, payload: { loading } });

export const loadProducts = (products: any[]) => ({ type: ActionTypes.PRODUCT_LIST_LOAD, payload: { products } });
export const loadProductDetail = (product: any) => ({ type: ActionTypes.PRODUCT_DETAIL_LOAD, payload: { product } });
export const setProductLoading = (loading: boolean) => ({ type: ActionTypes.PRODUCT_SET_LOADING, payload: { loading } });

export const loadOrders = (orders: any[]) => ({ type: ActionTypes.ORDER_LIST_LOAD, payload: { orders } });
export const createOrder = (order: any) => ({ type: ActionTypes.ORDER_CREATE, payload: { order } });
export const updateOrderStatus = (orderId: string, status: string) => ({ type: ActionTypes.ORDER_STATUS_UPDATE, payload: { orderId, status } });
export const deleteOrder = (orderId: string) => ({ type: ActionTypes.ORDER_DELETE, payload: { orderId } });
export const setOrderLoading = (loading: boolean) => ({ type: ActionTypes.ORDER_SET_LOADING, payload: { loading } });
export const setOrderFilter = (filter: { type?: string; status?: string }) => ({ type: ActionTypes.ORDER_SET_FILTER, payload: { filter } });

export const updateReservationForm = (form: any) => ({ type: ActionTypes.RESERVATION_FORM_UPDATE, payload: { form } });
export const submitReservation = (reservation: any) => ({ type: ActionTypes.RESERVATION_SUBMIT, payload: { reservation } });
export const clearReservationForm = () => ({ type: ActionTypes.RESERVATION_CLEAR });
export const setReservationLoading = (loading: boolean) => ({ type: ActionTypes.RESERVATION_SET_LOADING, payload: { loading } });

export const startPayment = (orderId: string) => ({ type: ActionTypes.PAYMENT_START, payload: { orderId } });
export const paymentSuccess = (orderId: string) => ({ type: ActionTypes.PAYMENT_SUCCESS, payload: { orderId } });
export const paymentFail = (orderId: string, error: string) => ({ type: ActionTypes.PAYMENT_FAIL, payload: { orderId, error } });
export const setPaymentStatus = (status: string) => ({ type: ActionTypes.PAYMENT_SET_STATUS, payload: { status } });
