declare const __DEV__: boolean;

declare const __PROD__: boolean;

declare interface EventTarget {
    value: string;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    dispatchEvent(e: Event): boolean;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

// declare interface SyntheticEvent {
//     bubbles: boolean;
//     cancelable: boolean;
//     currentTarget: EventTarget & T;
//     defaultPrevented: boolean;
//     eventPhase: number;
//     isTrusted: boolean;
//     nativeEvent: Event;
//     target: EventTarget & T;
//     timeStamp: Date;
//     type: string;
//     preventDefault(): void;
//     stopPropagation(): void;
// }

declare interface Reflect {
    get: (target: any, propertyKey: any) => void;
    has: (target: any, propertyKey: any) => boolean;
    apply: (target: any, thisArgument: any, argumentsList: any[]) => void;
    defineProperty: (target: any, propertyKey: number | string, attributes: any) => boolean;
    deleteProperty: (target: any, propertyKey: number | string) => boolean;
    prop: string;
}

declare interface ServiceWorkerConfig {
    onSuccess: (registration: ServiceWorkerRegistration) => void
    onUpdate: (registration: ServiceWorkerRegistration) => void
}

// declare const module: {
//     hot: {
//         accept (paths: string, callback: () => void | Promise<void>): void;
//     }
// }

// ... existing global typing defs
declare module 'tslib' {
    export function __extends (d: Func, b: Func): void;
    export function __assign (t: any, ...sources: any[]): any;
    export function __rest (t: any, propertyNames: string[]): any;
    export function __decorate (decorators: Func[], target: any, key?: string | symbol, desc?: any): any;
    export function __param (paramIndex: number, decorator: Func): Func;
    export function __metadata (metadataKey: any, metadataValue: any): Func;
    export function __awaiter (thisArg: any, _arguments: any, P: Func, generator: Func): any;
    export function __generator (thisArg: any, body: Func): any;
}
