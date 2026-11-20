import { Component } from 'react';
import Taro from '@tarojs/taro';
import './styles/global.scss';
import { AppShell } from './core/AppShell';

class App extends Component {
  componentDidMount() {
    this.initApp();
    this.initCloud();
  }

  componentDidShow() {
    this.checkSession();
  }

  componentDidHide() {}

  async initApp() {
    try {
      await AppShell.loadLocalConfig(require('../public/config/app.json'));
      console.log('[App] Config loaded, products:', AppShell.getProducts().length);
    } catch (e) {
      console.error('[App] Failed to load config:', e);
    }
  }

  async initCloud() {
    try {
      if (typeof Taro.cloud !== 'undefined') {
        Taro.cloud.init({ env: 'cloud1-d4gc2e7w9638ce590', traceUser: false });
        console.log('[App] Cloud initialized');
      }
    } catch (e) {
      console.warn('[App] Cloud init failed:', e);
    }
  }

  async checkSession() {
    try {
      await Taro.checkSession();
    } catch {
      Taro.removeStorageSync('auth_token');
      Taro.removeStorageSync('user_info');
    }
  }

  render() {
    return this.props.children;
  }
}

export default App;
