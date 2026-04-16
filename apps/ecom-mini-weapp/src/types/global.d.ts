declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '@tarojs/taro' {
  const Taro: any;
  export default Taro;
}

declare module '@tarojs/components' {
  export const View: any;
  export const Text: any;
  export const Image: any;
  export const ScrollView: any;
  export const Button: any;
  export const Input: any;
  export const Navigator: any;
  export const Swiper: any;
  export const SwiperItem: any;
  export const Icon: any;
  export const RichText: any;
  export const Progress: any;
  export const Checkbox: any;
  export const CheckboxGroup: any;
  export const Form: any;
  export const Switch: any;
  export const Radio: any;
  export const RadioGroup: any;
  export const Textarea: any;
  export const Picker: any;
  export const PickerView: any;
  export const PickerViewColumn: any;
  export const Slider: any;
  export const Label: any;
  export const CoverView: any;
  export const CoverImage: any;
  export const MovableArea: any;
  export const MovableView: any;
  export const ScrollView: any;
  export const Swiper: any;
  export const SwiperItem: any;
  export const FunctionalPageNavigator: any;
  export const LivePlayer: any;
  export const LivePusher: any;
  export const Video: any;
  export const Canvas: any;
  export const Ad: any;
  export const OpenData: any;
  export const WebView: any;
  export const EcoScrollView: any;
  export const EcoImage: any;
  export const EcoText: any;
  export const EcoView: any;
  export const EcoButton: any;
  export const EcoInput: any;
  export const EcoTextarea: any;
  export const EcoSwitch: any;
  export const EcoSlider: any;
  export const EcoPicker: any;
  export const EcoCheckbox: any;
  export const EcoRadio: any;
  export const EcoNavigator: any;
  export const EcoImage: any;
  export const EcoVideo: any;
  export const EcoCanvas: any;
  export const EcoMap: any;
  export const EcoWebView: any;
  export const EcoAd: any;
  export const EcoOpenData: any;
  export const EcoOfficialAccount: any;
  export const EcoSubscribeMessage: any;
  export const EcoContactButton: any;
  export const EcoCamera: any;
  export const EcoAudio: any;
  export const EcoLivePlayer: any;
  export const EcoLivePusher: any;
}

declare module '@tarojs/react' {
  export const useLoad: any;
  export const useReady: any;
  export const useUnload: any;
  export const usePullDownRefresh: any;
  export const useReachBottom: any;
  export const usePageScroll: any;
  export const useResize: any;
  export const useTabItemTap: any;
  export const useTitleClick: any;
  export const useOptionMenuClick: any;
  export const usePullIntercept: any;
  export const useShareAppMessage: any;
  export const useShareTimeline: any;
  export const useAddToFavorites: any;
  export const useRouter: any;
}

declare module 'react-redux' {
  export const Provider: any;
  export const useSelector: any;
  export const useDispatch: any;
  export const connect: any;
}

declare module '@reduxjs/toolkit' {
  export const configureStore: any;
  export const createSlice: any;
  export const createAsyncThunk: any;
}

// Core module declarations
declare module './core/AppShell' {
  export class AppShell {
    static loadConfig(configUrl?: string): Promise<any>;
    static loadLocalConfig(configObj: any): Promise<any>;
    static getConfig(): any;
    static isInitialized(): boolean;
  }
}

declare module './core/ConfigParser' {
  export class ConfigParser {
    static loadConfig(url?: string): Promise<any>;
    static loadLocalConfig(configObj: any): Promise<any>;
    static getConfig(): any;
    static getPage(pageId: string): any;
    static getMeta(): any;
  }
}

declare module './core/DataFetcher' {
  export class DataFetcher {
    static fetch(source: any, params?: Record<string, any>): Promise<any>;
    static registerTransformer(name: string, transform: (data: any) => any): void;
  }
}

declare module './core/ActionDispatcher' {
  export function dispatch(actions: any[], context?: any): () => Promise<void>;
  export function executeActions(actions: any[], context?: any): Promise<void>;
  export function registerAction(type: string, handler: Function): void;
}

declare module './core/ComponentRegistry' {
  export class ComponentRegistry {
    static register(name: string, component: any): void;
    static registerMany(components: any[]): void;
    static get(name: string): any;
    static has(name: string): boolean;
    static list(): string[];
  }
  export function withRegistration(component: any, name: string): any;
}

declare module './core/RenderEngine' {
  export function RenderEngine(props: { pageId: string; params?: Record<string, any> }): any;
}

declare module './core/types' {
  export interface AppConfig {
    meta: any;
    pages: any[];
    navigation?: any;
  }
  export interface PageConfig {
    id: string;
    type: string;
    title?: string;
    dataSource: any;
  }
  export interface DataSource {
    type: string;
    endpoint?: string;
    data?: any;
  }
  export interface Action {
    type: string;
    payload?: any;
  }
}
