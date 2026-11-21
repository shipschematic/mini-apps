import Taro from '@tarojs/taro';
import { Store } from '../../types';

export const locationService = {
  async openLocation(store: Store): Promise<void> {
    try {
      await Taro.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.name,
        address: store.address,
        scale: 18,
      });
    } catch (error) {
      Taro.showToast({ title: 'Failed to open map', icon: 'none' });
    }
  },

  async chooseLocation(): Promise<{ latitude: number; longitude: number; name?: string; address?: string } | null> {
    try {
      const result = await Taro.chooseLocation();
      if (result && result.latitude && result.longitude) {
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          name: result.name,
          address: result.address,
        };
      }
      return null;
    } catch (error) {
      Taro.showToast({ title: 'Failed to select location', icon: 'none' });
      return null;
    }
  },

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const setting = await Taro.getSetting();
      if (!setting.authSetting['scope.userLocation']) {
        const res = await Taro.authorize({ scope: 'scope.userLocation' });
        if (res.errMsg?.includes('ok')) {
          return getLocation();
        }
      } else {
        return getLocation();
      }
      return null;
    } catch {
      return null;
    }
  },
};

async function getLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const res = await Taro.getLocation({ type: 'gcj02' });
    return { latitude: res.latitude, longitude: res.longitude };
  } catch {
    return null;
  }
}
