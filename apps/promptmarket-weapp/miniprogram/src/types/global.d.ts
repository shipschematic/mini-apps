// Static asset module declarations
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

// NOTE: Do NOT declare modules for @tarojs/taro, @tarojs/components,
// @tarojs/react, react-redux, or @reduxjs/toolkit here.
// These packages ship their own TypeScript definitions.
// Overriding them with `any` destroys type safety across the entire app.
