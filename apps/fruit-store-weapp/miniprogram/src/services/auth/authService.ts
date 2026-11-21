import Taro from '@tarojs/taro';

export const authService = {
  async login(): Promise<{ success: boolean; error?: string }> {
    try {
      const loginRes = await Taro.login();

      if (!loginRes.code) {
        return { success: false, error: 'Login failed' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login error' };
    }
  },

  async logout(): Promise<void> {
    console.log('[AuthService] logout');
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
