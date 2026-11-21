const config = {
  projectName: 'minimalcove',
  date: '2026-05-08',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  copy: {
    patterns: [
      { from: 'src/theme.json', to: 'dist/theme.json' }
    ],
    options: {}
  },
  plugins: [],
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  cache: {
    enable: false
  }
}

export default config
