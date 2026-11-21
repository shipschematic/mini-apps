import Taro from '@tarojs/taro';

type ToastType = 'success' | 'error' | 'info' | 'none';

interface ToastOptions {
  title: string;
  type?: ToastType;
  duration?: number;
  mask?: boolean;
}

interface ModalOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

interface LoadingOptions {
  title?: string;
  mask?: boolean;
}

const TAB_BAR_PAGES = [
  '/pages/home/index',
  '/pages/orders/index',
  '/pages/reservation/index',
  '/pages/profile/index',
];

export const wxService = {
  showToast(options: ToastOptions): void {
    const iconMap: Record<ToastType, string> = {
      success: 'success',
      error: 'none',
      info: 'none',
      none: 'none',
    };

    Taro.showToast({
      title: options.title,
      icon: iconMap[options.type || 'none'],
      duration: options.duration || 2000,
      mask: options.mask,
    });
  },

  showLoading(options: LoadingOptions = {}): void {
    Taro.showLoading({
      title: options.title || 'Loading...',
      mask: options.mask ?? true,
    });
  },

  hideLoading(): void {
    Taro.hideLoading();
  },

  async showModal(options: ModalOptions): Promise<boolean> {
    const res = await Taro.showModal({
      title: options.title || 'Notice',
      content: options.content,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      showCancel: options.showCancel ?? true,
    });
    return res.confirm;
  },

  navigateTo(url: string): void {
    const isTabBar = TAB_BAR_PAGES.some(page => url.startsWith(page));
    if (isTabBar) {
      Taro.switchTab({ url });
    } else {
      Taro.navigateTo({ url });
    }
  },

  redirectTo(url: string): void {
    Taro.redirectTo({ url });
  },

  reLaunch(url: string): void {
    Taro.reLaunch({ url });
  },

  switchTab(url: string): void {
    Taro.switchTab({ url });
  },

  navigateBack(delta = 1): void {
    Taro.navigateBack({ delta });
  },

  async shareAppMessage(options?: {
    title?: string;
    path?: string;
    imageUrl?: string;
  }): Promise<void> {
    if (options) {
      Taro.showShareMenu({ withShareTicket: true });
    }
  },

  async scanCode(): Promise<{ result: string } | null> {
    try {
      const res = await Taro.scanCode({ onlyFromCamera: false });
      return { result: res.result };
    } catch {
      return null;
    }
  },
};
