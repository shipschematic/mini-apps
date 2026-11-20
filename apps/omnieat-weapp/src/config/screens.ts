export type ScreenId =
  | 'home'
  | 'search'
  | 'search-result'
  | 'categories'
  | 'saved'
  | 'favorite'
  | 'upload-recipe'
  | 'profile'
  | 'profile-user'
  | 'profile-recipe'
  | 'profile-livestream'
  | 'profile-insights'
  | 'edit-profile'
  | 'account'
  | 'settings'
  | 'theme'
  | 'language'
  | 'notifications'
  | 'notification-screen'
  | 'recipe-detail'
  | 'recipe-detail-share'
  | 'recipe-detail-scroll'
  | 'recipes-for-you'
  | 'recipe-my-recipes'
  | 'recipe-drafts'
  | 'explore'
  | 'live-cooking'
  | 'live-collaboration'
  | 'finish-cooking'
  | 'step-by-step'
  | 'comments'
  | 'reviews'
  | 'add-reviews'
  | 'create-account'
  | 'sign-in'
  | 'forgot-password'
  | 'reset-password'
  | 'account-verification'
  | 'account-verification-disable'
  | 'reset-email'
  | 'onboarding'
  | 'subscribe'
  | 'payment-method'
  | 'add-new-card'

export interface ScreenConfig {
  id: ScreenId
  name: string
  figmaNodeId: string
  pagePath: string
  description: string
}

export const SCREEN_CONFIGS: ScreenConfig[] = [
  { id: 'home', name: 'Home', figmaNodeId: '2208:6673', pagePath: 'pages/home/index', description: 'Main home screen with recipe feed' },
  { id: 'home', name: 'Home - Scroll', figmaNodeId: '2209:4975', pagePath: 'pages/home-scroll/index', description: 'Home with scrollable content' },
  { id: 'search', name: 'Search', figmaNodeId: '23:6919', pagePath: 'pages/search/index', description: 'Search screen' },
  { id: 'search-result', name: 'Search - Result', figmaNodeId: '23:7376', pagePath: 'pages/search-result/index', description: 'Search results screen' },
  { id: 'categories', name: 'Categories', figmaNodeId: '2209:6004', pagePath: 'pages/categories/index', description: 'Recipe categories' },
  { id: 'saved', name: 'Saved', figmaNodeId: '24:8803', pagePath: 'pages/saved/index', description: 'Saved recipes' },
  { id: 'favorite', name: 'Favorite Screen', figmaNodeId: '24:8803', pagePath: 'pages/favorite/index', description: 'Favorited recipes' },
  { id: 'upload-recipe', name: 'Upload recipe screen', figmaNodeId: '291:4590', pagePath: 'pages/upload/index', description: 'Upload new recipe' },
  { id: 'profile', name: 'Profile Screen - Recipe', figmaNodeId: '2216:9886', pagePath: 'pages/profile/index', description: 'User profile with recipes' },
  { id: 'profile-user', name: 'Profile User', figmaNodeId: '2228:7714', pagePath: 'pages/profile-user/index', description: 'Other user profile' },
  { id: 'profile-recipe', name: 'Profile Screen - Recipe', figmaNodeId: '2216:9886', pagePath: 'pages/profile-recipe/index', description: 'Profile with recipe tab' },
  { id: 'profile-livestream', name: 'Profile Screen - Livestream', figmaNodeId: '2216:10751', pagePath: 'pages/profile-livestream/index', description: 'Profile with livestream tab' },
  { id: 'profile-insights', name: 'Profile Insights Screen', figmaNodeId: '203:3802', pagePath: 'pages/profile-insights/index', description: 'Profile analytics and insights' },
  { id: 'edit-profile', name: 'Edit Profile', figmaNodeId: '133:1532', pagePath: 'pages/edit-profile/index', description: 'Edit user profile' },
  { id: 'account', name: 'Account Screen', figmaNodeId: '120:1973', pagePath: 'pages/account/index', description: 'Account settings' },
  { id: 'settings', name: 'Setting Screen', figmaNodeId: '226:3461', pagePath: 'pages/settings/index', description: 'App settings' },
  { id: 'theme', name: 'Theme screen', figmaNodeId: '124:1532', pagePath: 'pages/theme/index', description: 'Theme preferences' },
  { id: 'language', name: 'Language screen', figmaNodeId: '124:1658', pagePath: 'pages/language/index', description: 'Language settings' },
  { id: 'notifications', name: 'Notifications Screen', figmaNodeId: '124:1751', pagePath: 'pages/notifications/index', description: 'Notifications list' },
  { id: 'notification-screen', name: 'Notication Screen', figmaNodeId: '224:3093', pagePath: 'pages/notification-screen/index', description: 'Notification detail' },
  { id: 'recipe-detail', name: 'Recipe Detail', figmaNodeId: '2211:6859', pagePath: 'pages/recipe-detail/index', description: 'Recipe detail view' },
  { id: 'recipe-detail-share', name: 'Recipe Detail - Share', figmaNodeId: '2221:10971', pagePath: 'pages/recipe-detail-share/index', description: 'Share recipe screen' },
  { id: 'recipe-detail-scroll', name: 'Recipe Detail - Scroll', figmaNodeId: '2214:7307', pagePath: 'pages/recipe-detail-scroll/index', description: 'Scrollable recipe detail' },
  { id: 'recipes-for-you', name: 'Recipes For You', figmaNodeId: '2209:5643', pagePath: 'pages/recipes-for-you/index', description: 'Personalized recipes' },
  { id: 'recipe-my-recipes', name: 'Recipe Screen (My Recipes)', figmaNodeId: '199:3692', pagePath: 'pages/my-recipes/index', description: 'User own recipes' },
  { id: 'recipe-drafts', name: 'Recipe Screen (Drafts)', figmaNodeId: '69:1932', pagePath: 'pages/drafts/index', description: 'Draft recipes' },
  { id: 'explore', name: 'Explore', figmaNodeId: '2228:5849', pagePath: 'pages/explore/index', description: 'Explore recipes' },
  { id: 'live-cooking', name: 'Live Cooking', figmaNodeId: '24:8445', pagePath: 'pages/live-cooking/index', description: 'Live cooking session' },
  { id: 'live-collaboration', name: 'Live Collaboration Screen Detail', figmaNodeId: '2228:5796', pagePath: 'pages/live-collaboration/index', description: 'Live collaboration' },
  { id: 'finish-cooking', name: 'Finish Cooking Screen', figmaNodeId: '23:7938', pagePath: 'pages/finish-cooking/index', description: 'Cooking completion' },
  { id: 'step-by-step', name: 'Step by step Screen', figmaNodeId: '23:8061', pagePath: 'pages/step-by-step/index', description: 'Cooking instructions' },
  { id: 'comments', name: 'Comments', figmaNodeId: '125:1883', pagePath: 'pages/comments/index', description: 'Recipe comments' },
  { id: 'reviews', name: 'Reviews', figmaNodeId: '2214:8540', pagePath: 'pages/reviews/index', description: 'Recipe reviews' },
  { id: 'add-reviews', name: 'Add Reviews', figmaNodeId: '2216:8814', pagePath: 'pages/add-review/index', description: 'Add review' },
  { id: 'create-account', name: 'Create Account', figmaNodeId: '241:3711', pagePath: 'pages/create-account/index', description: 'Account creation' },
  { id: 'sign-in', name: 'Sign in', figmaNodeId: '22:1463', pagePath: 'pages/sign-in/index', description: 'Login screen' },
  { id: 'forgot-password', name: 'Forgot Password', figmaNodeId: '29:1037', pagePath: 'pages/forgot-password/index', description: 'Password recovery' },
  { id: 'reset-password', name: 'Reset Password', figmaNodeId: '32:1552', pagePath: 'pages/reset-password/index', description: 'Set new password' },
  { id: 'account-verification', name: 'Account Verification', figmaNodeId: '29:1565', pagePath: 'pages/verification/index', description: 'Verify account' },
  { id: 'account-verification-disable', name: 'Account Verification disable resend', figmaNodeId: '32:1062', pagePath: 'pages/verification-disabled/index', description: 'Verification with disabled resend' },
  { id: 'reset-email', name: 'Reset Email', figmaNodeId: '32:1304', pagePath: 'pages/reset-email/index', description: 'Email reset' },
  { id: 'onboarding', name: 'Onboarding Screen', figmaNodeId: '298:4057', pagePath: 'pages/onboarding/index', description: 'App onboarding' },
  { id: 'subscribe', name: 'Subscribe', figmaNodeId: '2229:8755', pagePath: 'pages/subscribe/index', description: 'Subscription plans' },
  { id: 'payment-method', name: 'Payment Method', figmaNodeId: '2229:9556', pagePath: 'pages/payment-method/index', description: 'Payment methods' },
  { id: 'add-new-card', name: 'Add New Card', figmaNodeId: '2229:9766', pagePath: 'pages/add-card/index', description: 'Add payment card' }
]

export const getScreenConfig = (id: ScreenId): ScreenConfig | undefined => {
  return SCREEN_CONFIGS.find(screen => screen.id === id)
}

export const getScreenConfigByPath = (path: string): ScreenConfig | undefined => {
  return SCREEN_CONFIGS.find(screen => screen.pagePath === path)
}