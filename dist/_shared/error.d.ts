import { Result } from '@sniptt/monads';
export type PromisedResult<TOk, TErr> = Promise<Result<TOk, TErr>>;
export type NotFoundError = {
    type: 'NotFoundError';
    message: string;
};
export declare const notFoundError: <T>(message: string) => import("@sniptt/monads/build/result/result").ResErr<T, NotFoundError>;
export type AlreadyExistsError = {
    type: 'AlreadyExistsError';
    message: string;
};
export declare const alreadyExistsError: <T>(message: string) => import("@sniptt/monads/build/result/result").ResErr<T, AlreadyExistsError>;
export type UnknownRuntimeError = {
    type: 'UnknownRuntimeError';
    message: string;
};
export declare const unknownRuntimeError: <T>(message: string) => import("@sniptt/monads/build/result/result").ResErr<T, UnknownRuntimeError>;
//# sourceMappingURL=error.d.ts.map