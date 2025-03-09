/**
 * TypeScript tip hatalarını tespit eden ve düzelten otomatik script
 * 
 * Kullanımı:
 * node scripts/fix-types.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Genel hatalar ve düzeltme şablonları
const commonErrors = [
  // Node.js ile ilgili hatalar
  {
    pattern: /Cannot find name '(require|process|__dirname|__filename)'/g,
    fix: () => {
      return {
        type: "type-augmentation",
        path: "types/node.d.ts",
        content: `
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    NEXT_PUBLIC_SUPABASE_PROJECT_ID: string;
    [key: string]: string | undefined;
  }
}

declare var process: NodeJS.Process;
interface NodeJS.Process {
  env: NodeJS.ProcessEnv;
}

declare var __dirname: string;
declare var __filename: string;
declare function require(id: string): any;
`
      };
    }
  },
  
  // React ile ilgili hatalar
  {
    pattern: /Cannot find module 'react'/g,
    fix: () => {
      return {
        type: "type-augmentation",
        path: "types/react.d.ts",
        content: `
declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  export type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  export interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
    new(props: P, context?: any): Component<P, S>;
    displayName?: string;
    defaultProps?: Partial<P>;
    contextType?: Context<any>;
  }
  export class Component<P = {}, S = {}, SS = any> {
    constructor(props: P, context?: any);
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: ReactInstance
    };
  }
  export type Key = string | number;
  export type ReactFragment = Iterable<ReactNode>;
  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  export interface ReactInstance { }
  export interface ComponentState { }
  export interface StaticLifecycle<P, S> { }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
  
  export type Context<T> = {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export type Provider<T> = any;
  export type Consumer<T> = any;
}
`
      };
    }
  },
  
  // Next.js ile ilgili hatalar
  {
    pattern: /Cannot find module 'next'/g,
    fix: () => {
      return {
        type: "type-augmentation",
        path: "types/next.d.ts",
        content: `
declare module 'next' {
  export type Metadata = {
    title?: string;
    description?: string;
    keywords?: string | string[];
    openGraph?: {
      title?: string;
      description?: string;
      images?: string[];
    };
    [key: string]: any;
  };
}

declare module 'next/link' {
  import { ReactNode } from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: ReactNode;
    [key: string]: any;
  }

  const Link: React.ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  const Image: React.ComponentType<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    quality?: number;
    className?: string;
    [key: string]: any;
  }>;
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
`
      };
    }
  },
  
  // Supabase ile ilgili hatalar
  {
    pattern: /Cannot find module '@supabase\/supabase-js'/g,
    fix: () => {
      return {
        type: "type-augmentation",
        path: "types/supabase.d.ts",
        content: `
declare module '@supabase/supabase-js' {
  export interface SupabaseClient<T = any> {
    from<Table extends string>(
      table: Table
    ): {
      select: (columns?: string) => Promise<{ data: any; error: Error | null }>;
      insert: (values: any) => Promise<{ data: any; error: Error | null }>;
      update: (values: any) => Promise<{ data: any; error: Error | null }>;
      delete: () => Promise<{ data: any; error: Error | null }>;
      eq: (column: string, value: any) => any;
      neq: (column: string, value: any) => any;
      gt: (column: string, value: any) => any;
      lt: (column: string, value: any) => any;
      gte: (column: string, value: any) => any;
      lte: (column: string, value: any) => any;
      order: (column: string, options?: { ascending?: boolean }) => any;
      limit: (count: number) => any;
    };
    auth: {
      signIn: (options: { email: string; password: string }) => Promise<{ data: any; error: Error | null }>;
      signUp: (options: { email: string; password: string }) => Promise<{ data: any; error: Error | null }>;
      signOut: () => Promise<{ error: Error | null }>;
      session: () => Promise<{ data: { session: any }; error: Error | null }>;
    };
    storage: {
      from: (bucket: string) => {
        upload: (path: string, file: File) => Promise<{ data: any; error: Error | null }>;
        download: (path: string) => Promise<{ data: any; error: Error | null }>;
        getPublicUrl: (path: string) => { publicURL: string };
      };
    };
    channel: (channel: string) => {
      on: (event: string, callback: (payload: any) => void) => any;
      subscribe: () => { unsubscribe: () => void };
    };
    removeChannel: (channel: any) => void;
  }

  export function createClient<T = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options?: any
  ): SupabaseClient<T>;
}
`
      };
    }
  },
  
  // JSX ile ilgili hatalar
  {
    pattern: /Property 'key' does not exist on type/g,
    fix: (filePath) => {
      // Bu dosyada JSX düzeltmesi yapmak gerekiyor
      // GameCard kullanım şeklini div içine alıp key'i div'e taşı
      const content = fs.readFileSync(filePath, 'utf8');
      
      // GameCard key özelliğini div'e taşı
      const fixedContent = content.replace(
        /<GameCard\s+key=\{([^}]+)\}/g, 
        '<div key={$1}>\n        <GameCard'
      ).replace(
        /<\/GameCard>/g,
        '</GameCard>\n      </div>'
      );
      
      return {
        type: "direct-fix",
        content: fixedContent
      };
    }
  },
  
  // Implicit any hatası
  {
    pattern: /Parameter '([^']+)' implicitly has an 'any' type/g,
    fix: (filePath, match) => {
      const paramName = match[1];
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Fonksiyon parametrelerini bul ve tip ekle
      const fixedContent = content.replace(
        new RegExp(`(function|=>)\\s*${paramName}\\s*\\(([^)]*)\\)`, 'g'),
        (match, funcType, params) => {
          // Parametrelere tip ekle
          const typedParams = params.split(',').map(param => {
            const trimmedParam = param.trim();
            if (trimmedParam === paramName) {
              return `${paramName}: any`;
            }
            return param;
          }).join(', ');
          
          return `${funcType} ${paramName}(${typedParams})`;
        }
      );
      
      return {
        type: "direct-fix",
        content: fixedContent
      };
    }
  },
  
  // Element implicitly has an 'any' type hatası
  {
    pattern: /Element implicitly has an 'any' type because expression of type 'string' can't be used to index type/g,
    fix: (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Obje tanımlamalarını bul ve index signature ekle
      const fixedContent = content.replace(
        /const\s+(\w+)\s*=\s*{}/g,
        'const $1: { [key: string]: any } = {}'
      );
      
      return {
        type: "direct-fix",
        content: fixedContent
      };
    }
  },
  
  // Error is of type 'unknown' hatası
  {
    pattern: /'error' is of type 'unknown'/g,
    fix: (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // catch bloğundaki error'a tip ekle
      const fixedContent = content.replace(
        /catch\s*\(\s*error\s*\)\s*{/g,
        'catch (error: any) {'
      );
      
      return {
        type: "direct-fix",
        content: fixedContent
      };
    }
  }
];

// Projeyi tara ve TypeScript hatalarını yakala
function findTypeScriptErrors() {
  try {
    // tsc ile type-check yaparak hataları al
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('Tebrikler! TypeScript hatası yok.');
    return [];
  } catch (error) {
    // Hata çıktısını parse et
    const errorOutput = error.stdout || '';
    const errors = [];
    
    // Hata mesajlarını regex ile parse et
    const errorRegex = /(.+)\((\d+),(\d+)\):\s+(.+)/g;
    let match;
    
    while ((match = errorRegex.exec(errorOutput)) !== null) {
      const [_, filePath, line, column, message] = match;
      errors.push({
        filePath,
        line: parseInt(line),
        column: parseInt(column),
        message
      });
    }
    
    return errors;
  }
}

// Hataları gruplama ve düzeltme
function fixErrors(errors) {
  const errorsByPattern = {};
  const fixedFiles = new Set();
  
  errors.forEach(error => {
    for (const commonError of commonErrors) {
      const regexMatch = commonError.pattern.exec(error.message);
      if (regexMatch) {
        const key = commonError.pattern.toString();
        if (!errorsByPattern[key]) {
          errorsByPattern[key] = {
            pattern: commonError.pattern,
            fix: commonError.fix,
            errors: [],
            matches: []
          };
        }
        errorsByPattern[key].errors.push(error);
        errorsByPattern[key].matches.push(regexMatch);
        break;
      }
    }
  });
  
  // Hata fixlerini uygula
  for (const key in errorsByPattern) {
    const { pattern, fix, errors, matches } = errorsByPattern[key];
    
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      const match = matches[i];
      
      try {
        const fixResult = fix(error.filePath, match);
        
        if (fixResult.type === "type-augmentation") {
          // Tür tanımlama dosyası ekle
          const typePath = path.resolve(__dirname, '..', fixResult.path);
          const typeDir = path.dirname(typePath);
          
          if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, { recursive: true });
          }
          
          // Eğer dosya varsa içeriğini kontrol et, yoksa oluştur
          if (fs.existsSync(typePath)) {
            const existingContent = fs.readFileSync(typePath, 'utf8');
            if (existingContent.trim() !== fixResult.content.trim()) {
              fs.writeFileSync(typePath, fixResult.content);
              console.log(`Tip tanımı dosyası güncellendi: ${fixResult.path}`);
            }
          } else {
            fs.writeFileSync(typePath, fixResult.content);
            console.log(`Yeni tip tanımı dosyası oluşturuldu: ${fixResult.path}`);
          }
        } else if (fixResult.type === "direct-fix") {
          // Dosyayı doğrudan düzelt
          fs.writeFileSync(error.filePath, fixResult.content);
          console.log(`Dosya doğrudan düzeltildi: ${error.filePath}`);
        }
        
        fixedFiles.add(error.filePath);
      } catch (err) {
        console.error(`Hata düzeltilirken bir sorun oluştu (${error.filePath}):`, err);
      }
    }
  }
  
  return fixedFiles;
}

// Ana işlem
console.log("TypeScript hatalarını kontrol ediyor...");
const errors = findTypeScriptErrors();

if (errors.length > 0) {
  console.log(`${errors.length} TypeScript hatası bulundu.`);
  console.log("Hataları düzeltmeye çalışılıyor...");
  
  const fixedFiles = fixErrors(errors);
  
  if (fixedFiles.size > 0) {
    console.log(`${fixedFiles.size} dosya düzeltildi. Lütfen tekrar kontrol edin.`);
  } else {
    console.log("Hiçbir dosya düzeltilemedi. Manuel düzeltme gerekebilir.");
  }
} else {
  console.log("Hiçbir TypeScript hatası bulunamadı. Kodunuz temiz!");
} 