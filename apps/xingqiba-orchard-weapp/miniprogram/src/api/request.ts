import Taro from '@tarojs/taro';

export const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.xingqiba.com/api';
  }
  return 'http://localhost:8080/api';
};

export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

const pendingRequests = new Map<string, Promise<any>>();

export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  deduplicate?: boolean;
}

export const request = async <T = any>(options: RequestOptions): Promise<any> => {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = 10000,
    deduplicate = false,
  } = options;

  const baseUrl = getApiBaseUrl();
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const requestKey = deduplicate ? `${method}:${fullUrl}:${JSON.stringify(data)}` : '';

  if (deduplicate && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  Taro.showLoading({ title: '加载中...', mask: true });

  const requestPromise = Taro.request({
    url: fullUrl,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...header,
    },
    timeout,
  })
    .then((response: any) => {
      if (isDev()) {
        console.log('[Response]', response);
      }
      if (response.statusCode === 401) {
        Taro.eventCenter.trigger('UNAUTHORIZED');
      }
      return response;
    })
    .catch((error: any) => {
      console.error('[Response Error]', error);
      Taro.hideLoading();
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 2000,
      });
      return Promise.reject(error);
    })
    .finally(() => {
      Taro.hideLoading();
      if (deduplicate) {
        pendingRequests.delete(requestKey);
      }
    });

  if (deduplicate) {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
};

export const get = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<any> => {
  return request<T>({ url, method: 'GET', data, ...options });
};

export const post = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<any> => {
  return request<T>({ url, method: 'POST', data, ...options });
};

export const put = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<any> => {
  return request<T>({ url, method: 'PUT', data, ...options });
};

export const del = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<any> => {
  return request<T>({ url, method: 'DELETE', data, ...options });
};
