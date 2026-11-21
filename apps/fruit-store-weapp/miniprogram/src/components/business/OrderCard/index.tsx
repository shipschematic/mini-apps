import { View, Text, Image } from '@tarojs/components';
import { Order } from '../../../types';
import { ORDER_STATUS_CONFIG } from '../../../constants';
import { formatDateTime } from '../../../utils/format';
import Tag from '../../common/Tag';
import PriceTag from '../../common/PriceTag';
import './OrderCard.scss';

interface OrderCardProps {
  order: Order;
  onPay?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onDetail?: (order: Order) => void;
  testid?: string;
  t?: (key: string) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPay,
  onCancel,
  onDelete,
  onDetail,
  testid,
  t = (k) => k,
}) => {
  const statusConfig = ORDER_STATUS_CONFIG.find((s) => s.value === order.status) || ORDER_STATUS_CONFIG[0];

  const handlePay = () => onPay?.(order);
  const handleCancel = () => onCancel?.(order);
  const handleDelete = () => onDelete?.(order);
  const handleDetail = () => onDetail?.(order);

  const renderActions = () => {
    switch (order.status) {
      case 'LOCKED':
        return (
          <View className="order-card__actions">
            <View className="order-card__action order-card__action--cancel" onClick={handleCancel} data-testid={testid ? `${testid}-cancel` : undefined}>
              <Text>{t('cancelOrder')}</Text>
            </View>
            <View className="order-card__action order-card__action--primary" onClick={handlePay} data-testid={testid ? `${testid}-pay` : undefined}>
              <Text>{t('payNow')}</Text>
            </View>
          </View>
        );
      case 'CANCELLED':
        return (
          <View className="order-card__actions">
            <View className="order-card__action order-card__action--default" onClick={handleDelete} data-testid={testid ? `${testid}-delete` : undefined}>
              <Text>{t('deleteOrder')}</Text>
            </View>
          </View>
        );
      case 'COMPLETED':
        return (
          <View className="order-card__actions">
            <View className="order-card__action order-card__action--default" onClick={handleDetail} data-testid={testid ? `${testid}-detail` : undefined}>
              <Text>{t('buyAgain')}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="order-card" onClick={handleDetail} data-testid={testid}>
      <View className="order-card__header">
        <Text className="order-card__order-no">{t('orderNo')}: {order.orderNo}</Text>
        <Tag text={t(statusConfig.labelKey)} type={order.status === 'LOCKED' ? 'warning' : order.status === 'COMPLETED' ? 'success' : 'info'} />
      </View>

      <View className="order-card__product">
        <Image
          className="order-card__product-image"
          src={order.productSnapshot.imageUrl}
          mode="aspectFill"
        />
        <View className="order-card__product-info">
          <Text className="order-card__product-title" numberOfLines={2}>
            {order.productSnapshot.title}
          </Text>
          <View className="order-card__product-price">
            <PriceTag price={order.productSnapshot.price} size="small" />
          </View>
        </View>
        <Text className="order-card__product-count">x{order.quantity}</Text>
      </View>

      <View className="order-card__footer">
        <View className="order-card__time">
          <Text>{formatDateTime(order.createTime)}</Text>
        </View>
        <View className="order-card__total">
          <Text className="order-card__total-label">{t('total')}: </Text>
          <PriceTag price={order.totalPrice} size="small" />
        </View>
      </View>

      {renderActions()}
    </View>
  );
};

export default OrderCard;
