// Mock for @tarojs/taro
const Taro = {
  request: jest.fn(() => Promise.resolve({ data: {} })),
  navigateTo: jest.fn(() => Promise.resolve()),
  switchTab: jest.fn(() => Promise.resolve()),
  navigateBack: jest.fn(() => Promise.resolve()),
  redirectTo: jest.fn(() => Promise.resolve()),
  reLaunch: jest.fn(() => Promise.resolve()),
  showToast: jest.fn(() => Promise.resolve()),
  showLoading: jest.fn(() => Promise.resolve()),
  hideLoading: jest.fn(() => Promise.resolve()),
  showModal: jest.fn(() => Promise.resolve({ confirm: false, cancel: false })),
  login: jest.fn(() => Promise.resolve({ code: 'test-code' })),
  getCurrentInstance: jest.fn(() => ({
    page: {
      $element: {
        style: {
          setProperty: jest.fn()
        }
      }
    }
  }))
}

export default Taro
export { Taro }
