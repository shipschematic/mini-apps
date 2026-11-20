import { useCallback } from 'react';
import { useStore } from '../store';
import Taro from '@tarojs/taro';
import { AppShell } from '../core/AppShell';

const CLOUD_ENV = 'cloud1-d4gc2e7w9638ce590';

function ensureCloudInit(): boolean {
  try {
    if (typeof Taro.cloud !== 'undefined') {
      Taro.cloud.init({ env: CLOUD_ENV, traceUser: false });
      return true;
    }
  } catch (_) {}
  return false;
}

export const useAuth = () => {
  const auth = useStore((state) => state.auth);
  const setAuth = useStore((state) => state.setAuth);
  const setUI = useStore((state) => state.setUI);

  const login = useCallback(async () => {
    try {
      setUI({ loading: true });
      let openid = '';
      let nickName = 'WeChat User';
      let avatarUrl = '';
      let isAdmin = false;

      const cloudReady = ensureCloudInit();

      if (cloudReady) {
        try {
          const res: any = await Taro.cloud.callFunction({
            name: 'xingqiba_login',
            data: {}
          });

          if (res.result?.success) {
            openid = res.result.data.openid;
            console.log('[Auth] Got openid from login function:', openid);
            
            try {
              const userRes: any = await Taro.cloud.callFunction({
                name: 'xingqiba_getUser',
                data: {}
              });
              if (userRes.result?.success && userRes.result.data) {
                if (userRes.result.data.name) nickName = userRes.result.data.name;
                if (userRes.result.data.avatar) avatarUrl = userRes.result.data.avatar;
                if (userRes.result.data.isAdmin) isAdmin = true;
              }
            } catch (_) {}
          }
        } catch (e: any) {
          console.warn('[Auth] Cloud login failed:', e);
        }
      }

      if (!openid) {
        const loginRes = await Taro.login();
        openid = loginRes.code || 'unknown-' + Date.now();
        console.log('[Auth] Using fallback login with code:', openid);
      }

      const config = AppShell.getConfigSafe();
      const adminIds = config?.meta?.adminIds || [];
      if (adminIds.includes(openid)) {
        isAdmin = true;
      }

      setAuth({
        user: {
          openid,
          nickname: nickName,
          avatarUrl,
        },
        token: openid,
        isLoggedIn: true,
        isAdmin,
      });

      Taro.showToast({ title: 'Login Success', icon: 'success' });
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      Taro.showToast({ title: 'Login Failed', icon: 'none' });
    } finally {
      setUI({ loading: false });
    }
  }, [setAuth, setUI]);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null, isLoggedIn: false, isAdmin: false });
    Taro.showToast({ title: 'Logged Out', icon: 'success' });
  }, [setAuth]);

  const checkSession = useCallback(async () => {
    try {
      await Taro.checkSession();
    } catch {
      setAuth({ user: null, token: null, isLoggedIn: false, isAdmin: false });
    }
  }, [setAuth]);

  return {
    user: auth.user,
    token: auth.token,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading,
    isAdmin: auth.isAdmin,
    login,
    logout,
    checkSession,
  };
};
