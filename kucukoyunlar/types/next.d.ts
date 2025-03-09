// React tanımlamaları
// React.ReactNode zaten react.d.ts dosyasında tanımlandığı için burada tekrar tanımlamıyoruz
// declare namespace React {
//   interface ReactNode {
//     children?: ReactNode | ReactNode[];
//   }
// }

// Next.js modül tanımlamaları
declare module 'next' {
  export type Metadata = {
    title?: string;
    description?: string;
    keywords?: string | string[];
    [key: string]: any;
  };
}

declare module 'next/link' {
  import { ElementType } from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  // Link bileşenini ElementType olarak tanımlıyoruz
  const Link: ElementType<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { ElementType } from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    quality?: number;
    className?: string;
    style?: React.CSSProperties;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (error: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    [key: string]: any;
  }

  // Image bileşenini ElementType olarak tanımlıyoruz
  const Image: ElementType<ImageProps>;
  export default Image;
}

declare module 'next/font/google' {
  interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    variable?: string;
    preload?: boolean;
    fallback?: string[];
  }

  export function Inter(options: FontOptions): {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };

  export function Poppins(options: FontOptions): {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };
}

// global modüller için tanımlamalar
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    NEXT_PUBLIC_SUPABASE_PROJECT_ID: string;
    [key: string]: string | undefined;
  }
}

// JSX elementleri için tanımlamalar
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 