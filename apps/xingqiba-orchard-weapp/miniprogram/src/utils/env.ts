import Taro from '@tarojs/taro';

const getEnv = () => {
  return Taro.getEnv();
};

const isDev = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  return getEnv() === 'WEAPP' && !isProduction();
};

const isProduction = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }
  return false;
};

export const isDevEnv = (): boolean => isDev();

export const isProdEnv = (): boolean => isProduction();

export const getApiBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  if (isProduction()) {
    return 'https://api.xingqiba.com/api';
  }
  return 'http://localhost:8080/api';
};

export const getCloudBaseEnvId = (): string => {
  if (typeof process !== 'undefined' && process.env && process.env.CLOUDBASE_ENV_ID) {
    return process.env.CLOUDBASE_ENV_ID;
  }
  // In production, we should never fall back to hardcoded values
  if (isProduction()) {
    throw new Error('CloudBase environment ID is required in production');
  }
  // Only allow hardcoded fallback in development for easier testing
  return 'cloud1-d4gc2e7w9638ce590';
};

export const getAppId = (): string => {
  if (typeof process !== 'undefined' && process.env && process.env.TARO_APP_ID) {
    return process.env.TARO_APP_ID;
  }
  // Fallback to project config if environment variable not set
  try {
    if (typeof wx !== 'undefined' && wx.getAccountInfoSync) {
      const accountInfo = wx.getAccountInfoSync();
      return accountInfo.miniProgram.appId;
    }
  } catch (error) {
    console.warn('Unable to get appId from WeChat environment');
  }
  return 'wx2ae5d48a13601dac'; // Default appId from project config
};

export const validateEnvironment = (): void => {
  if (isProduction()) {
    if (!getCloudBaseEnvId()) {
      throw new Error('CLOUDBASE_ENV_ID is required in production environment');
    }
    if (!getAppId()) {
      throw new Error('TARO_APP_ID is required in production environment');
    }
  }
};

export const getEnvironmentInfo = () => {
  return {
    isDevelopment: isDev(),
    isProduction: isProduction(),
    cloudbaseEnvId: getCloudBaseEnvId(),
    appId: getAppId(),
    apiBaseUrl: getApiBaseUrl(),
    nodeEnv: typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : 'unknown'
  };
};

export default {
  isDevEnv,
  isProdEnv,
  getApiBaseUrl,
  getCloudBaseEnvId,
  getAppId,
  validateEnvironment,
  getEnvironmentInfo,
};