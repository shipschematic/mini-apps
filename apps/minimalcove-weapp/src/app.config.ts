export default {
  pages: [
    'pages/kanban/index',
    'pages/eisenhower/index',
    'pages/analytics/index'
  ],
  window: {
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTitleText: 'MinimalCove',
    navigationBarTextStyle: '@navTxtStyle',
    backgroundColor: '@bgColor'
  },
  tabBar: {
    color: '@tabColor',
    selectedColor: '@tabSelectedColor',
    backgroundColor: '@tabBgColor',
    borderStyle: '@tabBorderStyle',
    list: [
      {
        pagePath: 'pages/kanban/index',
        text: 'Kanban'
      },
      {
        pagePath: 'pages/eisenhower/index',
        text: 'Eisenhower'
      },
      {
        pagePath: 'pages/analytics/index',
        text: 'Analytics'
      }
    ]
  },
  darkmode: true,
  themeLocation: 'theme.json'
}
