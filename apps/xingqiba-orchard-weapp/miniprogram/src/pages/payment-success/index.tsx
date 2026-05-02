import { View, Text } from '@tarojs/components';
import { wxService } from '../../services';
import { useI18n } from '../../hooks/useI18n';
import { ROUTES } from '../../constants';
import './index.scss';

function PaymentSuccessPage() {
  const { t } = useI18n();

  const handleViewOrder = () => {
    wxService.redirectTo(ROUTES.ORDERS);
  };

  const handleBackHome = () => {
    wxService.switchTab(ROUTES.HOME);
  };

  return (
    <View className="payment-success">
      <View className="payment-success__content">
        <View className="payment-success__icon">
          <Text>✅</Text>
        </View>
        <Text className="payment-success__title">{t('paymentSuccess')}</Text>
        <Text className="payment-success__subtitle">{t('thankYou')}</Text>
      </View>

      <View className="payment-success__actions">
        <View className="payment-success__btn payment-success__btn--default" onClick={handleBackHome}>
          <Text>{t('home')}</Text>
        </View>
        <View className="payment-success__btn payment-success__btn--primary" onClick={handleViewOrder}>
          <Text>{t('orderDetail')}</Text>
        </View>
      </View>
    </View>
  );
}

export default PaymentSuccessPage;
