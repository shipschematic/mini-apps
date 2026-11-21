const config = {
  projectName: 'fruit-store-weapp',
  date: '2026-04-23',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    CLOUDBASE_ENV_ID: JSON.stringify(process.env.CLOUDBASE_ENV_ID || 'cloud1-d4gc2e7w9638ce590'),
  },
  copy: {
    patterns: [
      {
        from: 'src/assets/images/',
        to: 'dist/assets/images/',
      },
      {
        from: 'src/theme.json',
        to: 'dist/theme.json',
      },
    ],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false,
  },
  mini: {
    compile: {
      exclude: [],
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
