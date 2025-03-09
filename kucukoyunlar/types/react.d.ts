/**
 * React için tip tanımlamaları
 */

import * as React from 'react';

declare module 'react' {
  // Key tipini tanımlıyoruz
  export type Key = string | number;

  // JSXElementConstructor tipini tanımlıyoruz
  export type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  // ReactElement tipini tanımlıyoruz
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  // ReactFragment tipini tanımlıyoruz
  export type ReactFragment = {} | Iterable<ReactNode>;

  // ReactPortal tipini tanımlıyoruz - children zorunlu değil
  export interface ReactPortal {
    key: Key | null;
    children?: ReactNode;
  }

  // ReactNode tipini tanımlıyoruz
  export type ReactNode = 
    | ReactElement<any, any>
    | ReactFragment
    | ReactPortal
    | string
    | number
    | boolean
    | null
    | undefined;

  // Component tipini tanımlıyoruz
  export class Component<P = {}, S = {}> {
    constructor(props: P, context?: any);
    props: P;
    state: S;
    context: any;
    refs: {
      [key: string]: any;
    };
    setState(state: S | ((prevState: S, props: P) => S), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }

  // ElementType tipini tanımlıyoruz
  export type ElementType<P = any> = 
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;

  // ComponentType tipini tanımlıyoruz
  export type ComponentType<P = {}> = 
    | ComponentClass<P>
    | FunctionComponent<P>;

  // ComponentClass tipini tanımlıyoruz
  export interface ComponentClass<P = {}, S = {}> {
    new(props: P, context?: any): Component<P, S>;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // FunctionComponent tipini tanımlıyoruz
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // FC tipini tanımlıyoruz (FunctionComponent'ın kısaltması)
  export type FC<P = {}> = FunctionComponent<P>;

  // ForwardRefExoticComponent tipini tanımlıyoruz
  export interface ForwardRefExoticComponent<P> {
    (props: P, ref?: React.Ref<any>): ReactElement | null;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // RefForwardingComponent tipini tanımlıyoruz
  export interface RefForwardingComponent<T, P = {}> {
    (props: P, ref?: React.Ref<T>): ReactElement | null;
    propTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // Ref tipini tanımlıyoruz
  export type Ref<T> = RefCallback<T> | RefObject<T> | null;

  // RefCallback tipini tanımlıyoruz
  export type RefCallback<T> = (instance: T | null) => void;

  // RefObject tipini tanımlıyoruz
  export interface RefObject<T> {
    readonly current: T | null;
  }

  // CSSProperties tipini tanımlıyoruz
  export interface CSSProperties {
    [key: string]: string | number | undefined;
  }

  // HTMLAttributes tipini tanımlıyoruz
  export interface HTMLAttributes<T> {
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }

  // InputHTMLAttributes tipini tanımlıyoruz
  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    capture?: boolean | 'user' | 'environment';
    checked?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | string[] | number;
    width?: number | string;
    onChange?: (event: any) => void;
    [key: string]: any;
  }

  // SyntheticEvent tipini tanımlıyoruz
  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
    timeStamp: number;
    type: string;
  }

  // React.createContext için tip tanımı
  export function createContext<T>(defaultValue: T): Context<T>;
  
  // Diğer eksik olabilecek React fonksiyonları için tip tanımları
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useContext<T>(context: Context<T>): T;

  // Context
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export type Provider<T> = any;
  export type Consumer<T> = any;

  // forwardRef
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement<any, any> | null
  ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

  export interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
    defaultProps?: Partial<P>;
  }

  export interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string;
  }

  export interface ExoticComponent<P = {}> {
    (props: P): ReactElement | null;
  }

  export type PropsWithoutRef<P> = P extends { ref?: infer R } ? Pick<P, Exclude<keyof P, 'ref'>> : P;
  export type RefAttributes<T> = { ref?: Ref<T> };
} 