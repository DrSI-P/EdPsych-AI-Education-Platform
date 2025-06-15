// Type declarations for common modules
declare module '*.svg' {
  const content: unknown;
  export default content;
}

declare module '*.png' {
  const content: unknown;
  export default content;
}

declare module '*.jpg' {
  const content: unknown;
  export default content;
}

declare module '*.jpeg' {
  const content: unknown;
  export default content;
}

declare module '*.gif' {
  const content: unknown;
  export default content;
}

declare module '*.webp' {
  const content: unknown;
  export default content;
}

// Add any type for problematic imports
declare module 'react-hot-toast';
declare module 'framer-motion';
declare module '@radix-ui/*';
declare module 'clsx';
declare module 'class-variance-authority';
declare module 'tailwind-merge';

// Global type extensions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}

export {};
