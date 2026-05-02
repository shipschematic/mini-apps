import { View, Text, Input, Textarea, Picker } from '@tarojs/components';
import { useState } from 'react';
import { useStore } from '../../store';
import { ProductList } from '../../components/business';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import { reservationApi } from '../../api';
import { wxService } from '../../services';
import { validateReservationForm } from '../../utils/validate';
import { ROUTES } from '../../constants';
import './index.scss';

function ReservationPage() {
  const { isLoggedIn, login, user } = useAuth();
  const currentStore = useStore((state) => state.store.currentStore);
  const products = useStore((state) => state.product.list);
  const formData = useStore((state) => state.reservation.formData);
  const submitting = useStore((state) => state.reservation.submitting);
  const errors = useStore((state) => state.reservation.errors);
  const setReservationAction = useStore((state) => state.setReservation);
  const { t } = useI18n();

  const [isExpanded, setIsExpanded] = useState(true);

  const handleInputChange = (field: string, value: any) => {
    setReservationAction({
      formData: { ...formData, [field]: value },
      errors: { ...errors, [field]: '' },
    });
  };

  const handlePhoneAuth = async () => {
    try {
      const res = await wxService.showModal({
        title: t('phoneAuth'),
        content: t('enterPhone'),
        confirmText: t('confirm'),
      });

      if (res) {
        handleInputChange('phone', '138****8888');
      }
    } catch (error) {
      console.error('Phone auth error:', error);
    }
  };

  const handleDateChange = (e: any) => {
    handleInputChange('appointmentDate', e.detail.value);
  };

  const handlePeopleChange = (e: any) => {
    handleInputChange('peopleCount', parseInt(e.detail.value) || 1);
  };

  const handleRemarkChange = (e: any) => {
    handleInputChange('remark', e.detail.value);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    const validation = validateReservationForm(formData);
    if (!validation.isValid) {
      setReservationAction({ errors: validation.errors });
      return;
    }

    setReservationAction({ submitting: true });

    try {
      const result = await reservationApi.submitReservation({
        ...formData,
        storeId: currentStore?.id || '',
        storeName: currentStore?.name || '',
        userName: user?.nickname || t('wechatUser'),
      });

      if (result?.reservationId) {
        wxService.showToast({ title: t('success'), type: 'success' });
        setReservationAction({
          formData: {
            storeId: currentStore?.id || '',
            storeName: currentStore?.name || '',
            userName: '',
            phone: '',
            appointmentDate: '',
            peopleCount: 1,
            remark: '',
          },
          errors: {},
        });
        wxService.switchTab(ROUTES.ORDERS);
      }
    } catch (error) {
      wxService.showToast({ title: t('fail'), type: 'error' });
    } finally {
      setReservationAction({ submitting: false });
    }
  };

  const handleCancel = () => {
    setReservationAction({
      formData: {
        storeId: currentStore?.id || '',
        storeName: currentStore?.name || '',
        userName: '',
        phone: '',
        appointmentDate: '',
        peopleCount: 1,
        remark: '',
      },
      errors: {},
    });
  };

  const handleProductBuy = (product: any) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    wxService.navigateTo(`${ROUTES.PRODUCT_DETAIL}?productId=${product.id}`);
  };

  return (
    <View className="reservation-page">
      <View className="reservation-page__form-card">
        <View
          className="reservation-page__form-header"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="reservation-form-header"
        >
          <Text className="reservation-page__form-title">
            {isExpanded ? t('collapse') + ' ▲' : t('expand') + ' ▼'}
          </Text>
          <Text
            className="reservation-page__form-close"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            ✕
          </Text>
        </View>

        {isExpanded && (
          <View className="reservation-page__form">
            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('storeName')}</Text>
              <Text className="reservation-page__value">{currentStore?.name || t('storeName')}</Text>
            </View>

            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('enterName')}</Text>
              <Input
                className="reservation-page__input"
                placeholder={t('enterName')}
                value={formData.userName}
                onInput={(e) => handleInputChange('userName', e.detail.value)}
                data-testid="input-name"
              />
            </View>

            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('enterPhone')}</Text>
              <View className="reservation-page__phone-row">
                <Input
                  className="reservation-page__input reservation-page__input--flex"
                  placeholder={t('enterPhone')}
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', e.detail.value)}
                  data-testid="input-phone"
                />
                <View className="reservation-page__auth-btn" onClick={handlePhoneAuth} data-testid="phone-auth-btn">
                  <Text>{t('enterPhone')}</Text>
                </View>
              </View>
              {errors.phone && <Text className="reservation-page__error">{errors.phone}</Text>}
            </View>

            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('selectDate')}</Text>
              <Picker
                mode="date"
                value={formData.appointmentDate}
                onChange={handleDateChange}
              >
                <View className="reservation-page__picker">
                  <Text className={formData.appointmentDate ? '' : 'reservation-page__placeholder'}>
                    {formData.appointmentDate || t('selectDate')}
                  </Text>
                </View>
              </Picker>
              {errors.appointmentDate && <Text className="reservation-page__error">{errors.appointmentDate}</Text>}
            </View>

            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('peopleCount')}</Text>
              <Picker
                mode="selector"
                range={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                onChange={handlePeopleChange}
              >
                <View className="reservation-page__picker">
                  <Text>{formData.peopleCount}{t('peopleCount')}</Text>
                </View>
              </Picker>
              {errors.peopleCount && <Text className="reservation-page__error">{errors.peopleCount}</Text>}
            </View>

            <View className="reservation-page__form-item">
              <Text className="reservation-page__label">{t('remark') || '备注'}</Text>
              <Textarea
                className="reservation-page__textarea"
                placeholder={t('remark') || '请输入备注信息（可选）'}
                value={formData.remark}
                onInput={handleRemarkChange}
              />
            </View>

            <View className="reservation-page__form-actions">
              <View
                className="reservation-page__btn reservation-page__btn--cancel"
                onClick={handleCancel}
                data-testid="reservation-cancel"
              >
                <Text>{t('cancel')}</Text>
              </View>
              <View
                className="reservation-page__btn reservation-page__btn--primary"
                onClick={handleSubmit}
                data-testid="reservation-submit"
              >
                {submitting ? (
                  <LoadingSpinner size="small" color="#ffffff" />
                ) : (
                  <Text>{t('submit')}</Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      <View className="reservation-page__section">
        <View className="reservation-page__section-header">
          <Text className="reservation-page__section-title">{t('groupBuy')}</Text>
        </View>
        <ProductList
          products={products}
          onBuy={handleProductBuy}
          layout="horizontal"
          t={t}
        />
      </View>
    </View>
  );
}

export default ReservationPage;
