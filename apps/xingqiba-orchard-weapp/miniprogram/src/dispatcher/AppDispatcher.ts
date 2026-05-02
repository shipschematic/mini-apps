import { EventChannel } from '@tarojs/taro';
import { ActionTypes, AppAction } from './ActionTypes';

type ActionCallback = (action: AppAction) => void;

class AppDispatcher {
  private static instance: AppDispatcher;
  private channels: EventChannel[] = [];
  private listeners: Set<ActionCallback> = new Set();

  private constructor() {}

  static getInstance(): AppDispatcher {
    if (!AppDispatcher.instance) {
      AppDispatcher.instance = new AppDispatcher();
    }
    return AppDispatcher.instance;
  }

  dispatch(action: AppAction): void {
    this.listeners.forEach((callback) => {
      try {
        callback(action);
      } catch (error) {
        console.error('[AppDispatcher] Listener error:', error);
      }
    });
  }

  register(callback: ActionCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  unregister(callback: ActionCallback): void {
    this.listeners.delete(callback);
  }

  createChannel(): EventChannel {
    const channel = new EventChannel('app_dispatcher_channel');
    this.channels.push(channel);
    return channel;
  }
}

export const dispatcher = AppDispatcher.getInstance();
export default dispatcher;
