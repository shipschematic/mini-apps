import {
  selectOrdersByTypeAndStatus,
  selectOrderCountsByStatus,
  selectActiveOrders,
} from '../../selectors/orderSelectors';
import { Order, OrderStatus, OrderType } from '../../types';

describe('orderSelectors', () => {
  const mockOrders: Order[] = [
    {
      id: '1',
      productId: 'p1',
      productName: '草莓',
      productImage: '草莓.jpg',
      type: 'direct' as OrderType,
      status: 'LOCKED' as OrderStatus,
      quantity: 2,
      totalPrice: 100,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      productId: 'p2',
      productName: '蓝莓',
      productImage: '蓝莓.jpg',
      type: 'direct' as OrderType,
      status: 'COMPLETED' as OrderStatus,
      quantity: 1,
      totalPrice: 50,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
    {
      id: '3',
      productId: 'p3',
      productName: '樱桃',
      productImage: '樱桃.jpg',
      type: 'reservation' as OrderType,
      status: 'LOCKED' as OrderStatus,
      quantity: 3,
      totalPrice: 200,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
    },
    {
      id: '4',
      productId: 'p4',
      productName: '苹果',
      productImage: '苹果.jpg',
      type: 'reservation' as OrderType,
      status: 'CANCELLED' as OrderStatus,
      quantity: 1,
      totalPrice: 30,
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04',
    },
  ];

  describe('selectOrdersByTypeAndStatus', () => {
    it('should filter orders by type and status', () => {
      const result = selectOrdersByTypeAndStatus(mockOrders, 'direct', 'LOCKED');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all orders when type is ALL', () => {
      const result = selectOrdersByTypeAndStatus(mockOrders, 'ALL', 'LOCKED');
      expect(result).toHaveLength(2);
    });

    it('should return all orders when status is ALL', () => {
      const result = selectOrdersByTypeAndStatus(mockOrders, 'direct', 'ALL');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no orders match', () => {
      const result = selectOrdersByTypeAndStatus(mockOrders, 'direct', 'CANCELLED');
      expect(result).toHaveLength(0);
    });
  });

  describe('selectOrderCountsByStatus', () => {
    it('should count orders by status correctly', () => {
      const result = selectOrderCountsByStatus(mockOrders);

      expect(result.ALL).toBe(4);
      expect(result.LOCKED).toBe(2);
      expect(result.COMPLETED).toBe(1);
      expect(result.CANCELLED).toBe(1);
    });

    it('should return zero counts when no orders exist', () => {
      const result = selectOrderCountsByStatus([]);

      expect(result.ALL).toBe(0);
      expect(result.LOCKED).toBe(0);
      expect(result.COMPLETED).toBe(0);
      expect(result.CANCELLED).toBe(0);
    });
  });

  describe('selectActiveOrders', () => {
    it('should return only locked orders', () => {
      const result = selectActiveOrders(mockOrders);

      expect(result).toHaveLength(2);
      expect(result.every((order) => order.status === 'LOCKED')).toBe(true);
    });

    it('should return empty array when no active orders', () => {
      const completedOrders = mockOrders.map((order) => ({
        ...order,
        status: 'COMPLETED' as OrderStatus,
      }));
      const result = selectActiveOrders(completedOrders);

      expect(result).toHaveLength(0);
    });
  });
});