import '@testing-library/jest-dom';

jest.mock('@tarojs/taro', () => ({
  EventChannel: jest.fn().mockImplementation(() => ({})),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn().mockResolvedValue({ confirm: true }),
  login: jest.fn().mockResolvedValue({ code: 'mock_code' }),
  checkSession: jest.fn().mockResolvedValue({}),
  navigateTo: jest.fn(),
  switchTab: jest.fn(),
}));

jest.mock('../store', () => {
  const actual = jest.requireActual('../store');
  return {
    ...actual,
    useStore: jest.fn(),
  };
});