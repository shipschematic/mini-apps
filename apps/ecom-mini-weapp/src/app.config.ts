export default {
  pages: [
    'pages/dynamic/index',
    'pages/detail/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/admin/index',
    'pages/admin/dashboard',
    'pages/admin/products',
    'pages/admin/orders',
    'pages/admin/settings'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Whitelabel Store',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#2A4B7C',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/dynamic/index',
        text: 'Home',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: 'Cart',
        iconPath: 'assets/icons/cart.png',
        selectedIconPath: 'assets/icons/cart-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: 'Profile',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json'
}
