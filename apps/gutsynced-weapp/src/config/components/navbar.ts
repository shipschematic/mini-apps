export type NavbarVariant = 'home' | 'saved' | 'upload-recipe' | 'collaboration' | 'profile' | 'search'

export interface NavbarConfig {
  id: string
  key: string
  name: string
  variant: NavbarVariant
}

export const NAVBAR_CONFIGS: NavbarConfig[] = [
  {
    id: '44:1730',
    key: '514b49d8f9441b29cb73a1432222364bac59125e',
    name: 'Navbar Light = Home',
    variant: 'home'
  },
  {
    id: '44:1804',
    key: 'a6187d571e75247fcb9a03d40218f6209af9207d',
    name: 'Navbar Light = Saved',
    variant: 'saved'
  },
  {
    id: '44:1768',
    key: 'db76df1cca2132afd5e377969d8b987e58b1aabb',
    name: 'Navbar Light = Upload Recipe',
    variant: 'upload-recipe'
  },
  {
    id: '44:1766',
    key: 'a02554a9a5fbc5b1cb7319765801ffcd8dddd881',
    name: 'Navbar Light = Collaboration',
    variant: 'collaboration'
  },
  {
    id: '44:1840',
    key: '7bb4eaca6d355ed23be02f8fdb11eb5808e2786b',
    name: 'Navbar Light = Profile',
    variant: 'profile'
  }
]

export const getNavbarConfig = (id: string): NavbarConfig | undefined => {
  return NAVBAR_CONFIGS.find(nav => nav.id === id)
}

export const getNavbarConfigByVariant = (variant: NavbarVariant): NavbarConfig | undefined => {
  return NAVBAR_CONFIGS.find(nav => nav.variant === variant)
}