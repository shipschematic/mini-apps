import { useMemo } from 'react';
import { useStore } from '../store';
import { Order, OrderStatus, OrderType } from '../types';
import { ORDER_STATUS_CONFIG } from '../constants';

export const selectOrdersByTypeAndStatus = (
  orders: Order[],
  type: OrderType | 'ALL',
  status: OrderStatus
): Order[] => {
  return orders.filter((order) => {
    const typeMatch = type === 'ALL' || order.type === type;
    const statusMatch = status === 'ALL' || order.status === status;
    return typeMatch && statusMatch;
  });
};

export const selectOrderCountsByStatus = (orders: Order[]): Record<OrderStatus, number> => {
  const counts: Record<OrderStatus, number> = {
    ALL: orders.length,
    LOCKED: 0,
    CANCELLED: 0,
    COMPLETED: 0,
  };

  orders.forEach((order) => {
    if (order.status === 'LOCKED') counts.LOCKED++;
    if (order.status === 'CANCELLED') counts.CANCELLED++;
    if (order.status === 'COMPLETED') counts.COMPLETED++;
  });

  return counts;
};

export const selectActiveOrders = (orders: Order[]): Order[] => {
  return orders.filter((order) => order.status === 'LOCKED');
};

export const useOrderSelectors = () => {
  const directOrders = useStore((state) => state.order.directOrders);
  const reservationOrders = useStore((state) => state.order.reservationOrders);
  const activeFilter = useStore((state) => state.order.activeFilter);

  const filteredDirectOrders = useMemo(
    () => selectOrdersByTypeAndStatus(directOrders, activeFilter.type, activeFilter.status),
    [directOrders, activeFilter]
  );

  const filteredReservationOrders = useMemo(
    () => selectOrdersByTypeAndStatus(reservationOrders, activeFilter.type, activeFilter.status),
    [reservationOrders, activeFilter]
  );

  const directOrderCounts = useMemo(() => selectOrderCountsByStatus(directOrders), [directOrders]);
  const reservationOrderCounts = useMemo(() => selectOrderCountsByStatus(reservationOrders), [reservationOrders]);

  return {
    filteredDirectOrders,
    filteredReservationOrders,
    directOrderCounts,
    reservationOrderCounts,
  };
};
