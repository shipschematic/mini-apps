import { View, Text } from '@tarojs/components';
import { wxService } from '../../services';
import { useI18n } from '../../hooks/useI18n';
import { ROUTES } from '../../constants';
import './index.scss';

function PaymentFailPage() {
  const { t } = useI18n();

  const handleRetry = () => {
    wxService.navigateTo(ROUTES.ORDERS);
  };

  const handleCancel = () => {
    wxService.switchTab(ROUTES.HOME);
  };

  return (
    <View className="payment-fail">
      <View className="payment-fail__content">
        <View className="payment-fail__icon">
          <Text>❌</Text>
        </View>
        <Text className="payment-fail__title">{t('paymentFailed')}</Text>
        <Text className="payment-fail__subtitle">{t('tryAgainLater')}</Text>
      </View>

      <View className="payment-fail__actions">
        <View className="payment-fail__btn payment-fail__btn--default" onClick={handleCancel}>
          <Text>{t('cancelOrder')}</Text>
        </View>
        <View className="payment-fail__btn payment-fail__btn--primary" onClick={handleRetry}>
          <Text>{t('retryPayment')}</Text>
        </View>
      </View>
    </View>
  );
}

export default PaymentFailPage;
