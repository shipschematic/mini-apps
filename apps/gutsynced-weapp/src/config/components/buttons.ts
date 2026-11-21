export type ButtonSize = 'small' | 'regular' | 'medium' | 'large'
export type ButtonType = 'regular' | 'outline' | 'ghost' | 'pill' | 'primary'
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled'

export interface ButtonConfig {
  id: string
  key: string
  name: string
  size: ButtonSize
  type: ButtonType
  state: ButtonState
  text: string
  hasLeftIcon: boolean
  hasRightIcon: boolean
  leftIcon?: string
  rightIcon?: string
}

export const BUTTON_CONFIGS: ButtonConfig[] = [
  {
    id: '1039:24249',
    key: '94f5646bbdd5d5157a030d6fd5e9845406612fc4',
    name: 'State=Hover, Size=Pill, Type=Regular',
    size: 'medium',
    type: 'pill',
    state: 'hover',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1039:24257',
    key: '5eb42d9c0a551f919335c06be099b638932f9618',
    name: 'State=Active, Size=Pill, Type=Regular',
    size: 'medium',
    type: 'pill',
    state: 'active',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1039:24218',
    key: 'd204f4988c0d77586cd6fb034efcbcf0560a17e1',
    name: 'State=Disabled, Size=Regular, Type=Regular',
    size: 'regular',
    type: 'regular',
    state: 'disabled',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1033:23409',
    key: '6e5f1efd22d07a825e33d16d1e6012a05fa90182',
    name: 'State=Default, Size=Pill, Type=Outline',
    size: 'medium',
    type: 'pill',
    state: 'default',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1033:23401',
    key: 'c4acb2a9e98675e888695792237ec197ee17f239',
    name: 'State=Default, Size=Regular, Type=Regular',
    size: 'regular',
    type: 'regular',
    state: 'default',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1006:23352',
    key: '302d9b8194e7a5a169a06fb5a061aa823908a2a3',
    name: 'State=Hover, Size=Regular, Type=Regular',
    size: 'regular',
    type: 'regular',
    state: 'hover',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1006:23360',
    key: '7c13310428ed151b9585236e9e6c7a1a68182dc3',
    name: 'State=Active, Size=Regular, Type=Regular',
    size: 'regular',
    type: 'regular',
    state: 'active',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1006:23368',
    key: 'e9c0805f6e6d9bdd56573030f91b2af4d98b9f34',
    name: 'State=Ghost, Size=Regular, Type=Regular',
    size: 'regular',
    type: 'ghost',
    state: 'default',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1006:23338',
    key: '92d64cdefb532d999012840824e03818cee863a0',
    name: 'State=Default, Size=Regular, Type=Outline',
    size: 'regular',
    type: 'outline',
    state: 'default',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1006:23326',
    key: 'e1cf9efc913ebb8573f8bd70b726499b3412f3f9',
    name: 'Property 1=Plus with container',
    size: 'regular',
    type: 'regular',
    state: 'default',
    text: '',
    hasLeftIcon: true,
    hasRightIcon: false,
    leftIcon: 'plus'
  },
  {
    id: '1006:23400',
    key: '1497a5025b51a2c6b4f4263041a896c1eed4d14e',
    name: 'State=Default, Size=Pill, Type=Regular',
    size: 'medium',
    type: 'pill',
    state: 'default',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1039:24238',
    key: 'ba74b6bfe83b75a2df83130e400d52bd3408a39b',
    name: 'State=Disabled, Size=Pill, Type=Regular',
    size: 'medium',
    type: 'pill',
    state: 'disabled',
    text: 'Add more ingredients',
    hasLeftIcon: false,
    hasRightIcon: false
  }
]

export const getButtonConfig = (id: string): ButtonConfig | undefined => {
  return BUTTON_CONFIGS.find(btn => btn.id === id)
}

export const getButtonConfigsByState = (state: ButtonState): ButtonConfig[] => {
  return BUTTON_CONFIGS.filter(btn => btn.state === state)
}

export const getButtonConfigsByType = (type: ButtonType): ButtonConfig[] => {
  return BUTTON_CONFIGS.filter(btn => btn.type === type)
}