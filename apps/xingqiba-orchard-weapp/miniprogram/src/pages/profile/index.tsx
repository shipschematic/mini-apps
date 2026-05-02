import { View, Text, Image } from '@tarojs/components';
import { useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { useOrderSelectors } from '../../selectors';
import { ServiceGrid } from '../../components/business';
import { useAuth } from '../../hooks';
import { useI18n } from '../../hooks/useI18n';
import { LOCALES } from '../../constants/i18n';
import { ServiceItem, OrderStatus } from '../../types';
import { wxService } from '../../services';
import { ROUTES } from '../../constants';
import { dispatchAction } from '../../store';
import { AppShell } from '../../core/AppShell';
import './index.scss';

function ProfilePage() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { directOrderCounts } = useOrderSelectors();
  const { locale, toggleLocale, t } = useI18n();

  const [updateKey, setUpdateKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const forceUpdate = useCallback(() => {
    setUpdateKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.openid) {
      checkAdmin(user.openid);
    }
  }, [isLoggedIn, user?.openid]);

  const checkAdmin = async (openid: string) => {
    try {
      const config = AppShell.getConfigSafe();
      const configAdminIds = (config as any)?.adminIds || [];

      if (configAdminIds.includes(openid)) {
        setIsAdmin(true);
        return;
      }

      if (typeof Taro.cloud !== 'undefined') {
        const res: any = await Taro.cloud.callFunction({
          name: 'xingqiba_getUser',
          data: {}
        });

        if (res.result?.success && res.result?.data?.isAdmin) {
          setIsAdmin(true);
        }
      }
    } catch (e) {}
  };

  useDidShow(() => {
    forceUpdate();
  });

  const currentLocaleLabel = LOCALES.find(l => l.locale === locale)?.label || '中文';

  const handleServiceClick = (item: ServiceItem) => {
    if (item.authRequired && !isLoggedIn) {
      login();
      return;
    }
    if (item.pageUrl === '/pages/profile/settings/index') {
      toggleLocale();
      setTimeout(() => forceUpdate(), 50);
      return;
    }

    if (item.pageUrl === '/pages/admin/index' && !isAdmin) {
      wxService.showToast({ title: 'Admin only' });
      return;
    }

    wxService.navigateTo(item.pageUrl);
  };

  const handleOrderClick = (status: string) => {
    if (status !== 'ALL') {
      dispatchAction({ type: 'ORDER_SET_FILTER', payload: { filter: { status: status as OrderStatus } } });
    }
    wxService.navigateTo(ROUTES.ORDERS);
  };

  const handleLogout = async () => {
    const confirm = await wxService.showModal({
      content: t('logout') + '?',
      confirmText: t('confirm'),
      cancelText: t('cancel'),
    });
    if (confirm) {
      logout();
      setIsAdmin(false);
    }
  };

  return (
    <View className="profile-page" key={updateKey}>
      <View className="profile-page__header">
        <View className="profile-page__user-info">
          <Image
            className="profile-page__avatar"
            src={user?.avatarUrl || '/assets/images/default-avatar.png'}
            mode="aspectFill"
          />
          <View className="profile-page__user-detail" onClick={() => !isLoggedIn && login()}>
            <Text className="profile-page__nickname">
              {isLoggedIn ? (user?.nickname || t('wechatUser')) : t('clickToLogin')}
            </Text>
            {isAdmin && (
              <Text className="profile-page__admin-badge">🛡 Admin</Text>
            )}
            {isLoggedIn && (
              <Text className="profile-page__logout" onClick={handleLogout}>
                {t('logout')}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="profile-page__orders-card">
        <View className="profile-page__card-header">
          <Text className="profile-page__card-title">{t('myOrders')}</Text>
          <Text className="profile-page__card-more" onClick={() => handleOrderClick('ALL')}>
            {t('viewAll')} &gt;
          </Text>
        </View>

        <View className="profile-page__order-grid">
          <View
            className="profile-page__order-item"
            onClick={() => handleOrderClick('LOCKED')}
          >
            <View className="profile-page__order-icon-wrap profile-page__order-icon-wrap--progress">
              <Text className="profile-page__order-icon-text">⏱</Text>
            </View>
            <Text className="profile-page__order-label">{t('inProgress')}</Text>
            {directOrderCounts.LOCKED > 0 && (
              <View className="profile-page__order-badge">
                <Text>{directOrderCounts.LOCKED}</Text>
              </View>
            )}
          </View>

          <View
            className="profile-page__order-item"
            onClick={() => handleOrderClick('CANCELLED')}
          >
            <View className="profile-page__order-icon-wrap profile-page__order-icon-wrap--cancel">
              <Text className="profile-page__order-icon-text">✕</Text>
            </View>
            <Text className="profile-page__order-label">{t('cancelled')}</Text>
          </View>

          <View
            className="profile-page__order-item"
            onClick={() => handleOrderClick('COMPLETED')}
          >
            <View className="profile-page__order-icon-wrap profile-page__order-icon-wrap--done">
              <Text className="profile-page__order-icon-text">✓</Text>
            </View>
            <Text className="profile-page__order-label">{t('completed')}</Text>
            {directOrderCounts.COMPLETED > 0 && (
              <View className="profile-page__order-badge">
                <Text>{directOrderCounts.COMPLETED}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="profile-page__services-card">
        <View className="profile-page__card-header">
          <Text className="profile-page__card-title">{t('myServices')}</Text>
        </View>
        <ServiceGrid onItemClick={handleServiceClick} t={t as (key: string) => string} />
      </View>

      <View className="profile-page__settings-card">
        <View className="profile-page__card-header">
          <Text className="profile-page__card-title">{t('settings')}</Text>
        </View>
        <View className="profile-page__setting-item" onClick={() => { toggleLocale(); setTimeout(() => forceUpdate(), 50); }}>
          <Text className="profile-page__setting-label">{t('language')}</Text>
          <View className="profile-page__setting-value">
            <Text>{currentLocaleLabel}</Text>
            <Text className="profile-page__setting-arrow">&gt;</Text>
          </View>
        </View>
      </View>

      <View className="profile-page__version">
        <Text>v2.1.0</Text>
      </View>
    </View>
  );
}

export default ProfilePage;
