export type InputType = 'text' | 'search' | 'username' | 'password' | 'number'
export type InputState = 'normal' | 'focus' | 'disable' | 'error'

export interface InputConfig {
  id: string
  key: string
  name: string
  type: InputType
  state: InputState
  label?: string
  hasLabel: boolean
  hintText?: string
  hasHint: boolean
  placeholder: string
  hasLeftIcon: boolean
  hasRightIcon: boolean
}

export const INPUT_CONFIGS: InputConfig[] = [
  {
    id: '1036:27904',
    key: '88cdb06e8c8e0b0afcc42c24b97b56ce15ab9515',
    name: 'State=Disable',
    type: 'text',
    state: 'disable',
    placeholder: 'Input form',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1036:27889',
    key: 'b46c3d7425ca0d80c8d749e21548f4c6799860ea',
    name: 'State=Focus',
    type: 'text',
    state: 'focus',
    placeholder: 'Input form',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '1008:23332',
    key: 'dd4a8db2428255fc9f5d7e0c38c447e05d9e14bf',
    name: 'State=Default',
    type: 'text',
    state: 'normal',
    placeholder: 'Input form',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '147:1492',
    key: 'ae50cadedca389bf3a193577dab61b914c8d8cb3',
    name: 'Select/Select',
    type: 'text',
    state: 'normal',
    placeholder: 'Placeholder',
    hasLeftIcon: false,
    hasRightIcon: false
  },
  {
    id: '147:1491',
    key: 'e8397bbebdec3e918ad2ab1df75a0500fbf8e825',
    name: 'Select/Selected',
    type: 'text',
    state: 'normal',
    placeholder: 'Placeholder',
    hasLeftIcon: false,
    hasRightIcon: false
  }
]

export const getInputConfig = (id: string): InputConfig | undefined => {
  return INPUT_CONFIGS.find(input => input.id === id)
}