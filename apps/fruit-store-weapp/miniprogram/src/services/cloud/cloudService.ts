import Taro from '@tarojs/taro';
import { getCloudBaseEnvId } from '../../utils/env';

let isInitialized = false;

export interface CloudFunctionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const cloudService = {
  init(): boolean {
    if (isInitialized) {
      return true;
    }

    const envId = getCloudBaseEnvId();

    if (!envId || envId === 'your_cloudbase_env_id_here' || envId === 'your_production_cloudbase_env_id') {
      console.warn('[CloudBase] Environment ID not configured. Set CLOUDBASE_ENV_ID in .env file.');
      return false;
    }

    try {
      Taro.cloud.init({
        env: envId,
        traceUser: true,
      });
      isInitialized = true;
      console.log('[CloudBase] Initialized with env:', envId);
      return true;
    } catch (error) {
      console.error('[CloudBase] init failed:', error);
      return false;
    }
  },

  async callFunction<T = any>(
    name: string,
    data?: any
  ): Promise<CloudFunctionResult<T>> {
    const envId = getCloudBaseEnvId();

    if (!envId || envId === 'your_cloudbase_env_id_here' || envId === 'your_production_cloudbase_env_id') {
      return {
        success: false,
        error: 'CloudBase not configured. Please configure CLOUDBASE_ENV_ID.',
      };
    }

    try {
      const res = await Taro.cloud.callFunction({
        name,
        data: data || {},
      });
      return {
        success: true,
        data: res.result as T,
      };
    } catch (error: any) {
      console.error(`[CloudBase] callFunction ${name} failed:`, error);
      return {
        success: false,
        error: error.message || 'Cloud function call failed',
      };
    }
  },

  async uploadFile(options: { filePath: string; cloudPath: string }): Promise<{ success: boolean; fileID?: string; error?: string }> {
    try {
      const res = await Taro.cloud.uploadFile({
        filePath: options.filePath,
        cloudPath: options.cloudPath,
      });
      return {
        success: true,
        fileID: res.fileID,
      };
    } catch (error: any) {
      console.error('[CloudBase] uploadFile failed:', error);
      return {
        success: false,
        error: error.message || 'File upload failed',
      };
    }
  },

  async downloadFile(options: { fileID: string }): Promise<{ success: boolean; tempFilePath?: string; error?: string }> {
    try {
      const res = await Taro.cloud.downloadFile({
        fileID: options.fileID,
      });
      return {
        success: true,
        tempFilePath: res.tempFilePath,
      };
    } catch (error: any) {
      console.error('[CloudBase] downloadFile failed:', error);
      return {
        success: false,
        error: error.message || 'File download failed',
      };
    }
  },

  isReady(): boolean {
    return isInitialized;
  },
};

export default cloudService;