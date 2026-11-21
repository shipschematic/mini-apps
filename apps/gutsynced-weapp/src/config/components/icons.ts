export type IconName =
  | 'back'
  | 'arrow'
  | 'search'
  | 'notification'
  | 'language'
  | 'moon'
  | 'help'
  | 'logout'
  | 'calendar'
  | 'plus'
  | 'checklist'
  | 'home'
  | 'collaboration'
  | 'plus-in-box'
  | 'bookmark'
  | 'profile'
  | 'camera'
  | 'trash'
  | 'pencil'
  | 'comment'
  | 'at'
  | 'add-friends'
  | 'google'
  | 'facebook'
  | 'apple'
  | 'eyes-open'
  | 'eyes-close'
  | 'remove'
  | 'delete'
  | 'outline-bookmark'
  | 'receipt-tax'
  | 'mail'
  | 'lock'
  | 'user'
  | 'dots-vertical'
  | 'x'
  | 'star'
  | 'credit-card'
  | 'check'
  | 'edit'
  | 'file'
  | 'heart'
  | 'outline-heart'
  | 'chevron-right'
  | 'share'
  | 'info'
  | 'warning'
  | 'link'

export interface IconConfig {
  id: string
  key: string
  name: string
  iconName: IconName
}

export const ICON_CONFIGS: IconConfig[] = [
  { id: '1014:23386', key: 'a69a5202a6b161a5be9e30017d9d5e868be69197', name: 'Property 1=Back', iconName: 'back' },
  { id: '1034:23961', key: 'd2b04c565b110be99d08c5f0fa7357df93497f3b', name: 'Property 1=Arrow', iconName: 'arrow' },
  { id: '1025:23263', key: '97b47c6d5554f337cd254647a506dbc482e3f885', name: 'Property 1=Notification', iconName: 'notification' },
  { id: '1039:31404', key: '67caf25c0bd5226868fa33c0df968b24db5adc76', name: 'Property 1=Language', iconName: 'language' },
  { id: '1039:31403', key: '905c7d5741cc6926bea5110c972f72f5eef1d7ba', name: 'Property 1=Moon', iconName: 'moon' },
  { id: '1039:31402', key: 'f8d0c78629735b9ea8f08a504455a58316bcdd6c', name: 'Property 1=Help', iconName: 'help' },
  { id: '1039:31401', key: '79b856015df5ec67a0bc0609f3096f7cff238752', name: 'Property 1=Logout', iconName: 'logout' },
  { id: '1034:24027', key: 'fbc7e96be30ed42bfc9a7ddda39dffd3df39a3ca', name: 'Property 1=Calendar', iconName: 'calendar' },
  { id: '1014:23613', key: '50554b9af90c591d769b2e6775922d988c5fa866', name: 'Property 1=Kebab', iconName: 'dots-vertical' },
  { id: '1034:23833', key: 'b3b577891bb7295d75bad71f878365c90d2d6830', name: 'Property 1=Plus', iconName: 'plus' },
  { id: '1019:23049', key: '35c8e6943b714c136f8ccdda7ea696a6b00c7408', name: 'Property 1=Checklist', iconName: 'checklist' },
  { id: '1016:38764', key: '5060027ef4c06931426eee0a4b3daa3d44ee6358', name: 'Property 1=Home', iconName: 'home' },
  { id: '1016:38765', key: '2e512aef96afd5100da83922058fc5e49c21b482', name: 'Property 1=Collaboration', iconName: 'collaboration' },
  { id: '1016:38766', key: '93394b3f994e43cc522caeb7a24b93c0a222763a', name: 'Property 1=Plus in Box', iconName: 'plus-in-box' },
  { id: '1016:38767', key: '7a1847963e12f39dd03cb4371df2636e377ec80a', name: 'Property 1=Bookmark', iconName: 'bookmark' },
  { id: '1016:38768', key: '7acbd81f85adeccb00d0c88ad9551b2341b2c228', name: 'Property 1=Profile', iconName: 'profile' },
  { id: '1039:30894', key: 'c8d88f33c5f3f7976bceeade120ad46f6714c7cb', name: 'Property 1=Camera', iconName: 'camera' },
  { id: '1033:23365', key: '83e341b53c0517cd876b5823e9d421a32fd26e80', name: 'Property 1=Trash', iconName: 'trash' },
  { id: '1039:24422', key: 'ba74b6bfe83b75a2df83130e400d52bd3408a39b', name: 'Property 1=Pencil', iconName: 'pencil' },
  { id: '1022:23147', key: '532fd1ed3a7bc2ca7144de50e46f5ba8076973a9', name: 'Property 1=Comment', iconName: 'comment' },
  { id: '1024:23195', key: '538802308d524bbdd242ade06b5c50b65eb42e60', name: 'Property 1=At', iconName: 'at' },
  { id: '1024:23194', key: 'fa737460f3f218736ee970a1afa851f8de943eb1', name: 'Property 1=Add Friends', iconName: 'add-friends' },
  { id: '1020:23178', key: '667b24ad562f02736d89c012948e396aa8be0011', name: 'Property 1=Google', iconName: 'google' },
  { id: '1020:23177', key: '6825f228d72bdd0f3d5e61511545c5dbad35aefc', name: 'Property 1=Faceboook', iconName: 'facebook' },
  { id: '1020:23179', key: 'db7a6f4cf79145f0dd79f488578efc3079e20eb7', name: 'Property 1=Apple', iconName: 'apple' },
  { id: '1020:23262', key: 'b62edc759643878bd4a1d90373a5d1a0dacff4f1', name: 'Property 1=Eyes Open', iconName: 'eyes-open' },
  { id: '1020:23261', key: '3923f404919608edf6a04c7146dc2b45809e2202', name: 'Property 1=Eyes Close', iconName: 'eyes-close' },
  { id: '1020:23444', key: 'adcc6448bfc1fae3c071699a8efa2e435e6102d2', name: 'Property 1=Remove', iconName: 'remove' },
  { id: '1008:23356', key: '270f09367d95b4e038278ef2f6ab47d3ac198a18', name: 'Property 1=Delete', iconName: 'delete' },
  { id: '1016:23416', key: '0e03a65c9a3fef948a525d14b7f5e32e9d9136ca', name: 'Property 1=Outlined Bookmark', iconName: 'outline-bookmark' },
  { id: '2229:8280', key: '075c341bbb592999f41d2da2706eec1ae1183502', name: 'Icon/Solid/receipt-tax', iconName: 'receipt-tax' },
  { id: '2221:11266', key: '6bf3a8fa8726b8ab6b5375b79ecc4f6b110091c8', name: 'message', iconName: 'mail' },
  { id: '2221:11275', key: '9314a0ed419be950f3f577a03befb5b1cf0cf3e7', name: 'dots-vertical', iconName: 'dots-vertical' },
  { id: '2211:6263', key: 'bfcc99dd567dd39473e039d6f3817e9ccecd0a06', name: 'x', iconName: 'x' },
  { id: '1025:23355', key: '83c6a03652fb0b208f181af6adf60aefef8e5f5a', name: 'Property 1=Search', iconName: 'search' },
  { id: '2221:11270', key: 'abc123456789def456789abc123def456789abc', name: 'lock', iconName: 'lock' },
  { id: '2221:11271', key: 'def456789abc123def456789abc123def456789', name: 'user', iconName: 'user' }
]

export const getIconConfig = (id: string): IconConfig | undefined => {
  return ICON_CONFIGS.find(icon => icon.id === id)
}

export const getIconConfigByName = (name: IconName): IconConfig | undefined => {
  return ICON_CONFIGS.find(icon => icon.iconName === name)
}