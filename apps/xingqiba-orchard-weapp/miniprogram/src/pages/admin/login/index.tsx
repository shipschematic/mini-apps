import { View, Text, Image, Button } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { useAuth } from '../../../hooks';
import { AppShell } from '../../../core/AppShell';
import './index.scss';

export default function AdminLogin() {
  const { user, isLoggedIn, login } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, [isLoggedIn, user?.openid]);

  const checkAdminAccess = async () => {
    setChecking(true);
    setError('');

    if (!isLoggedIn || !user?.openid) {
      setChecking(false);
      return;
    }

    try {
      const config = AppShell.getConfigSafe();
      const configAdminIds = (config as any)?.adminIds || [];

      if (configAdminIds.includes(user.openid)) {
        setIsAdmin(true);
        setChecking(false);
        return;
      }

      if (typeof Taro.cloud !== 'undefined') {
        const res: any = await Taro.cloud.callFunction({
          name: 'xingqiba_getUser',
          data: {}
        });

        if (res.result?.success && res.result?.data?.isAdmin) {
          setIsAdmin(true);
          setChecking(false);
          return;
        }
      }

      setError('Your account does not have admin access');
    } catch (e) {
      setError('Failed to verify admin access');
    }

    setChecking(false);
  };

  const handleLoginAndCheck = async () => {
    await login();
    setTimeout(() => checkAdminAccess(), 1000);
  };

  const handleGoAdmin = () => {
    Taro.setStorageSync('admin_verified', 'true');
    Taro.redirectTo({ url: '/pages/admin/products/index' });
  };

  if (checking) {
    return (
      <View className="admin-login">
        <View className="admin-login__container">
          <Text>Checking admin access...</Text>
        </View>
      </View>
    );
  }

  if (isAdmin) {
    return (
      <View className="admin-login">
        <View className="admin-login__container">
          <View className="admin-login__header">
            <Image className="admin-login__logo" src="/assets/images/logo.png" mode="aspectFit" />
            <Text className="admin-login__title">Admin Access Granted</Text>
          </View>
          <Text className="admin-login__welcome">Welcome, {user?.nickname || 'Admin'}</Text>
          <Button className="admin-login__btn" type="primary" onClick={handleGoAdmin}>
            Enter Admin Panel
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="admin-login">
      <View className="admin-login__container">
        <View className="admin-login__header">
          <Image className="admin-login__logo" src="/assets/images/logo.png" mode="aspectFit" />
          <Text className="admin-login__title">Xingqiba Orchard Admin</Text>
        </View>

        {!isLoggedIn ? (
          <View className="admin-login__form">
            <Text className="admin-login__hint">Please login with WeChat first</Text>
            <Button
              className="admin-login__btn"
              type="primary"
              onClick={handleLoginAndCheck}
            >
              Login with WeChat
            </Button>
          </View>
        ) : (
          <View className="admin-login__form">
            <Text className="admin-login__error">{error}</Text>
            <Text className="admin-login__hint">
              Contact the orchard owner to add your openid to admin list:
            </Text>
            <Text className="admin-login__openid">{user?.openid}</Text>
            <Button
              className="admin-login__btn"
              onClick={() => Taro.navigateBack()}
            >
              Go Back
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
