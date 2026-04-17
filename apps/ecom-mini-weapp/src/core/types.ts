/**
 * Core TypeScript Interfaces for Whitelabel E-commerce Framework
 * These interfaces define the SSOT JSON Schema structure
 */

import React from 'react'

// ==================== Meta Configuration ====================
export interface MetaConfig {
  appName: string;
  primaryColor: string;
  secondaryColor?: string;
  currency: string;
  locale?: string;
  features: string[];
  theme?: {
    borderRadius?: string;
    fontFamily?: string;
    spacing?: Record<string, string>;
  };
}

// ==================== Data Source ====================
export type DataSourceType = 'api' | 'static' | 'store' | 'function';

export interface DataSource {
  type: DataSourceType;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  prop?: string;
  function?: string;
  transformer?: string;
  headers?: Record<string, string>;
  body?: any;
}

// ==================== Actions ====================
export interface Action {
  type: string;
  payload?: any;
  params?: Record<string, any>;
}

export interface ActionsConfig {
  onItemClick?: Action[];
  onBuy?: Action[];
  onAddToCart?: Action[];
  onWishlist?: Action[];
  onShare?: Action[];
  [key: string]: Action[] | undefined;
}

// ==================== Component Layout ====================
export interface LayoutComponent {
  component: string;
  prop: string;
  config?: any;
}

// ==================== Page Configuration ====================
export type PageType = 'grid' | 'list' | 'detail' | 'form' | 'cart' | 'profile';

export interface PageConfig {
  id: string;
  type: PageType;
  title?: string;
  dataSource: DataSource;
  itemTemplate?: string;
  layout?: LayoutComponent[];
  actions?: ActionsConfig;
  template?: string;
  styles?: Record<string, any>;
  columns?: number;
  showSearch?: boolean;
  showFilter?: boolean;
  enablePullRefresh?: boolean;
  onRefresh?: Action[];
  onLoadMore?: Action[];
}

// ==================== Component Configuration ====================
export interface ComponentConfig {
  name?: string;
  props?: Record<string, any>;
  styles?: Record<string, any>;
  events?: string[];
}

// ==================== Root Configuration ====================
export interface AppConfig {
  meta: MetaConfig;
  pages: PageConfig[];
  products?: any[];
  components?: ComponentConfig[];
  navigation?: {
    defaultPage: string;
    tabBar?: {
      show: boolean;
      items: Array<{
        pageId: string;
        text: string;
        icon?: string;
        selectedIcon?: string;
      }>;
    };
  };
}

// ==================== Runtime Types ====================
export interface PageContext {
  pageId: string;
  params?: Record<string, any>;
  data?: any;
}

export interface ComponentContext {
  componentId: string;
  data?: any;
  config?: any;
  pageContext?: PageContext;
}

export interface DispatchContext {
  pageContext: PageContext;
  componentContext?: ComponentContext;
  store: any;
  responseData?: any;
  error?: any;
}

// ==================== Store State ====================
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  variant?: any;
  price: number;
  data?: any;
}

export interface WishlistItem {
  id: string;
  productId: string;
  data?: any;
}

export interface AppState {
  cart: {
    items: CartItem[];
    total: number;
    itemCount: number;
  };
  wishlist: WishlistItem[];
  user: {
    id?: string;
    name?: string;
    avatar?: string;
    phone?: string;
    isLoggedIn: boolean;
  };
  orders: any[];
  browsingHistory: string[];
}

// ==================== Action Handler Types ====================
export type ActionHandler = (payload: any, context: DispatchContext) => Promise<void> | void;

export interface ActionRegistry {
  [type: string]: ActionHandler;
}

// ==================== Component Registry ====================
export type ComponentType = React.FC<any> | any;

export interface ComponentRegistryItem {
  name: string;
  component: ComponentType;
  config?: ComponentConfig;
}

// ==================== Utility Types ====================
export type TemplateFunction = (data: any, config: any) => string;

export interface DataTransformer {
  name: string;
  transform: (data: any) => any;
}
