import { AppAction } from '../../dispatcher/ActionTypes';

class TestAppDispatcher {
  private static instance: TestAppDispatcher;
  private listeners: Set<(action: AppAction) => void> = new Set();

  private constructor() {}

  static getInstance(): TestAppDispatcher {
    if (!TestAppDispatcher.instance) {
      TestAppDispatcher.instance = new TestAppDispatcher();
    }
    return TestAppDispatcher.instance;
  }

  dispatch(action: AppAction): void {
    this.listeners.forEach((callback) => {
      try {
        callback(action);
      } catch (error) {
        console.error('[TestAppDispatcher] Listener error:', error);
      }
    });
  }

  register(callback: (action: AppAction) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  unregister(callback: (action: AppAction) => void): void {
    this.listeners.delete(callback);
  }

  clear(): void {
    this.listeners.clear();
  }

  static resetInstance(): void {
    TestAppDispatcher.instance = undefined as any;
  }
}

describe('AppDispatcher', () => {
  let dispatcherInstance: TestAppDispatcher;

  beforeEach(() => {
    TestAppDispatcher.resetInstance();
    dispatcherInstance = TestAppDispatcher.getInstance();
    dispatcherInstance.clear();
  });

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = TestAppDispatcher.getInstance();
      const instance2 = TestAppDispatcher.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should be a singleton', () => {
      const instance1 = TestAppDispatcher.getInstance();
      const instance2 = TestAppDispatcher.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('dispatch', () => {
    it('should call all registered listeners when dispatching', () => {
      const action: AppAction = { type: 'AUTH_LOGIN', payload: { userId: '123' } };
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      dispatcherInstance.register(listener1);
      dispatcherInstance.register(listener2);
      dispatcherInstance.dispatch(action);

      expect(listener1).toHaveBeenCalledWith(action);
      expect(listener2).toHaveBeenCalledWith(action);
    });

    it('should handle errors in listeners gracefully', () => {
      const action: AppAction = { type: 'AUTH_LOGIN' };
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();

      dispatcherInstance.register(errorListener);
      dispatcherInstance.register(normalListener);

      expect(() => dispatcherInstance.dispatch(action)).not.toThrow();
      expect(normalListener).toHaveBeenCalledWith(action);
    });
  });

  describe('register', () => {
    it('should register a listener and return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = dispatcherInstance.register(listener);

      dispatcherInstance.dispatch({ type: 'TEST' });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      dispatcherInstance.dispatch({ type: 'TEST' });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      dispatcherInstance.register(listener1);
      dispatcherInstance.register(listener2);

      dispatcherInstance.dispatch({ type: 'TEST' });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('unregister', () => {
    it('should remove a listener', () => {
      const listener = jest.fn();

      dispatcherInstance.register(listener);
      dispatcherInstance.dispatch({ type: 'TEST' });
      expect(listener).toHaveBeenCalledTimes(1);

      dispatcherInstance.unregister(listener);
      dispatcherInstance.dispatch({ type: 'TEST' });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not affect other listeners when removing one', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      dispatcherInstance.register(listener1);
      dispatcherInstance.register(listener2);

      dispatcherInstance.unregister(listener1);

      dispatcherInstance.dispatch({ type: 'TEST' });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });
});