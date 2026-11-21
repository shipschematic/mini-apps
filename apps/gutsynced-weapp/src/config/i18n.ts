export type Language = 'en' | 'zh'

type Dictionary = Record<string, string>

const en: Dictionary = {
  search_foods: 'Search foods...',
  favorites: 'Favorites',
  clear_favorites: 'Clear Favorites',
  no_results: 'No foods found matching search criteria.',
  no_results_hint: 'Try adjusting your search or filters',
  all_food: 'All Food',
  green: 'Green',
  yellow: 'Yellow',
  red: 'Red',
  home: 'Home',
  settings: 'Settings',
  account: 'Account',
  preferences: 'Preferences',
  about: 'About',
  sign_in: 'Sign in',
  sign_out: 'Sign Out',
  signed_in_as: 'Signed in as',
  backup_favorites: 'Backup favorites to cloud',
  active_diet: 'Active Diet',
  dark_mode: 'Dark Mode',
  language: 'Language',
  version: 'Version',
  data_source: 'Data Source',
  local_cloud: 'Local JSON + Cloud Sync',
  email: 'Email',
  password: 'Password',
  create_account: 'Create Account',
  auth_subtitle: 'Your SIBO diet companion',
  auth_switch_signup: "Don't have an account? Sign Up",
  auth_switch_signin: 'Already have an account? Sign In',
  auth_signup_hint: 'Sign up to backup your favorites to the cloud',
  select_diet: 'Select Diet',
  status: 'Status',
  category: 'Category',
  note: 'Note',
  copy_name: 'Copy Name',
  copied: 'Name copied',
  food_not_found: 'Food item not found',
  favorites_empty: 'No favorites yet',
  favorites_empty_hint: 'Tap the heart icon to save foods',
  favorites_count: 'Favorites',
  cancel: 'Cancel',
  system: 'System',
  on: 'On',
  off: 'Off'
}

const zh: Dictionary = {
  search_foods: '搜索食物...',
  favorites: '收藏夹',
  clear_favorites: '清除收藏',
  no_results: '未找到符合搜索条件的食物。',
  no_results_hint: '请调整搜索或筛选条件',
  all_food: '全部食物',
  green: '绿色',
  yellow: '黄色',
  red: '红色',
  home: '首页',
  settings: '设置',
  account: '账户',
  preferences: '偏好设置',
  about: '关于',
  sign_in: '登录',
  sign_out: '退出登录',
  signed_in_as: '已登录',
  backup_favorites: '将收藏备份到云端',
  active_diet: '当前饮食',
  dark_mode: '深色模式',
  language: '语言',
  version: '版本',
  data_source: '数据来源',
  local_cloud: '本地 JSON + 云端同步',
  email: '邮箱',
  password: '密码',
  create_account: '创建账户',
  auth_subtitle: '您的 SIBO 饮食助手',
  auth_switch_signup: '没有账户？注册',
  auth_switch_signin: '已有账户？登录',
  auth_signup_hint: '注册后可将收藏备份到云端',
  select_diet: '选择饮食',
  status: '状态',
  category: '类别',
  note: '备注',
  copy_name: '复制名称',
  copied: '名称已复制',
  food_not_found: '未找到该食物',
  favorites_empty: '还没有收藏',
  favorites_empty_hint: '点击爱心图标收藏食物',
  favorites_count: '收藏',
  cancel: '取消',
  system: '跟随系统',
  on: '开',
  off: '关'
}

const dictionaries: Record<Language, Dictionary> = { en, zh }

const categoryTranslations: Record<Language, Dictionary> = {
  en: {
    Cereals: 'Cereals',
    Dairy: 'Dairy',
    Drinks: 'Drinks',
    'Fats/Oils': 'Fats/Oils',
    Fruits: 'Fruits',
    Legumes: 'Legumes',
    Meats: 'Meats',
    'Nuts/Seeds': 'Nuts/Seeds',
    'Seasonings/Condiments': 'Seasonings/Condiments',
    Sweeteners: 'Sweeteners',
    Veggies: 'Veggies'
  },
  zh: {
    Cereals: '谷物',
    Dairy: '乳制品',
    Drinks: '饮料',
    'Fats/Oils': '脂肪/油',
    Fruits: '水果',
    Legumes: '豆类',
    Meats: '肉类',
    'Nuts/Seeds': '坚果/种子',
    'Seasonings/Condiments': '调味品/佐料',
    Sweeteners: '甜味剂',
    Veggies: '蔬菜',
    'Vegetables & Legumes': '蔬菜和豆类',
    Proteins: '蛋白质',
    'Grains & Starches': '谷物和淀粉',
    Vegetables: '蔬菜',
    'Dairy & Milk Alternatives': '乳制品和奶替代品',
    Beverages: '饮品',
    'Sweeteners & Flavor Additions': '甜味剂和调味品',
    'Nuts & Seeds': '坚果和籽类',
    'Flavorings & Sweeteners': '调味品和甜味剂',
    Fats: '脂肪'
  }
}

export function translate(lang: Language, key: string): string {
  return dictionaries[lang][key] ?? key
}

export function translateCategory(lang: Language, name: string): string {
  return categoryTranslations[lang][name] ?? name
}
