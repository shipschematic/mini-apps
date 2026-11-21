import type { Config } from '@tarojs/taro'

const config: any = {
  projectName: 'gutsynced',
  date: '2026-5-18',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {
    // Hardcoded values for testing - Taro will replace these at compile time
    'process.env.TARO_APP_URL': JSON.stringify('http://localhost:10080'),
    'process.env.API_BASE_URL': JSON.stringify('http://localhost:3000'),
    'process.env.GOOGLE_CLIENT_ID': JSON.stringify('test-google-id'),
    'process.env.WECHAT_APP_ID': JSON.stringify('test-wechat-id')
  },
  copy: {
    patterns: [
      { from: 'src/sitemap.json', to: 'dist/sitemap.json' },
      { from: 'src/theme.json', to: 'dist/theme.json' }
    ],
    options: {}
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  cache: {
    enable: false
  },
  mini: {
    hot: true,
    commonChunks: ['runtime', 'taro', 'vendors', 'common'],
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: './',
    staticDirectory: 'static',
    html: 'index.html',
    router: {
      mode: 'hash'
    },
    devServer: {
      port: 10080,
      disableHostCheck: true
    },
    webpackChain(chain: any) {
      chain.optimization.splitChunks({
        cacheGroups: {
          default: false,
          vendors: false
        }
      });
      chain.optimization.runtimeChunk(false);
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          overrideBrowserslist: ['iOS >= 9', 'Android >= 4.4', 'Chrome > 50']
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      },
      pxtransform: {
        enable: true,
        config: {
          designWidth: 375,
          deviceRatio: {
            375: 2 / 1,
            640: 2.34 / 2,
            750: 1,
            828: 1.81 / 2
          }
        }
      }
    }
  },
  rn: {
    appName: 'gutsynced',
    codePushKey: {
      ios: '',
      android: ''
    }
  }
}

export default config