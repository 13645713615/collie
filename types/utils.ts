/**
 * @name 指定必有
 * @msg:
 * @return {*}
 */
export declare type RequireFormat<T, P extends keyof T> = Required<{
    [k in P]: T[k];
}> & Pick<T,Exclude<keyof T, P>>