import Taro from '@tarojs/taro';
import { get, post } from './request';
import { cloudService } from '../services/cloud/cloudService';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export const code2session = async (code: string): Promise<ApiResponse<{ openid: string; session_key: string }>> => {
  try {
    const result = await cloudService.callFunction<{ openid: string; session_key: string }>('code2Session', { code });
    if (result.success && result.data) {
      return { code: 0, message: 'success', data: result.data, success: true };
    }
    return { code: -1, message: result.error || 'Failed', data: null as any, success: false };
  } catch (error) {
    console.error('[AuthApi] code2session error:', error);
    return { code: -1, message: 'Network error', data: null as any, success: false };
  }
};

export const loginByCode = async (code: string): Promise<ApiResponse<{ token: string; user: any }>> => {
  try {
    const result = await cloudService.callFunction<{ token: string; user: any }>('login', { code });
    if (result.success && result.data) {
      return { code: 0, message: 'success', data: result.data, success: true };
    }
    return { code: -1, message: result.error || 'Failed', data: null as any, success: false };
  } catch (error) {
    console.error('[AuthApi] loginByCode error:', error);
    return { code: -1, message: 'Network error', data: null as any, success: false };
  }
};

export const getPhoneNumber = async (code: string): Promise<ApiResponse<{ phone: string }>> => {
  try {
    const result = await cloudService.callFunction<{ phone: string }>('getPhoneNumber', { code });
    if (result.success && result.data) {
      return { code: 0, message: 'success', data: result.data, success: true };
    }
    return { code: -1, message: result.error || 'Failed', data: null as any, success: false };
  } catch (error) {
    console.error('[AuthApi] getPhoneNumber error:', error);
    return { code: -1, message: 'Network error', data: null as any, success: false };
  }
};

export const authService = {
  async login(): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      const loginRes = await Taro.login();

      if (!loginRes.code) {
        return { success: false, error: 'Login failed' };
      }

      const result = await cloudService.callFunction<{ token: string; user: any }>('login', {
        code: loginRes.code,
      });

      if (result.success && result.data) {
        return { success: true, token: result.data.token, user: result.data.user };
      }

      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('[AuthService] login error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async logout(): Promise<void> {
    Taro.removeStorageSync('auth_token');
    Taro.removeStorageSync('user_info');
  },

  async checkSession(): Promise<boolean> {
    try {
      await Taro.checkSession();
      return true;
    } catch {
      return false;
    }
  },

  async getPhone(): Promise<string | null> {
    return null;
  },
};

export default authService;