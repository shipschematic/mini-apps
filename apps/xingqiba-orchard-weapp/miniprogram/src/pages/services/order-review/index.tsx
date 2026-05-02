import { View, Text } from '@tarojs/components';
import { useI18n } from '../../../hooks/useI18n';
import './index.scss';

function OrderReviewPage() {
  const { t } = useI18n();

  return (
    <View className="service-page">
      <View className="service-page__header">
        <Text className="service-page__title">{t('orderReview')}</Text>
      </View>
      <View className="service-page__empty">
        <Text className="service-page__empty-text">{t('noOrders')}</Text>
      </View>
    </View>
  );
}
export default OrderReviewPage;
