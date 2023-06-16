import { delay as d, identity, isEmpty } from "lodash"
export const hasOwn = Object.prototype.hasOwnProperty;

export function splicing<S = null | undefined | string | { [k: string]: boolean | null | undefined }, M = S | S[]>(...args: M[]): string {
    const values: (string | number)[] = [];
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) continue;

        if (typeof arg === 'string') {
            values.push(arg);
        } if (Array.isArray(arg)) {
            let inner = splicing.apply(null, arg);
            if (inner) {
                values.push(inner);
            }
        } else if (typeof arg === "object") {
            for (let key in arg) {
                if (hasOwn.call(arg, key) && arg[key]) {
                    values.push(key);
                }
            }
        }
    }

    return values.join(' ');
}



/**
 * @name 计数
 * @msg: 
 * @param {*} param1
 * @return {*}
 */
export const nextIndex = (() => {
    let count = 100;
    return () => count++
})()


/**
 *  契约
 */
export const contract = <T>(): { result: Promise<T>, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void } => {
    let resolve, reject, result = new Promise<T>((res, rej) => { resolve = res; reject = rej; })
    return { resolve, reject, result } as any
}


/**
 * 延迟
 * @param  {number} wait
 */
export const delay = (wait: number) => {
    const { result, resolve } = contract();
    d(resolve, wait);
    return result
}

/**
 * 判空，可以为0
 * @param value 
 * @returns 
 */
export const isNil = (value: unknown) => {
    if (typeof value === "number" && value == 0) {
        return false
    } else {
        return isEmpty(value)
    }
}

/**
 * 迭代器映射
 * @param object 
 * @param callback 
 * @returns 
 */
export const iteratorMap = <T, R>(object: Iterable<T>, callback: (value: T) => R | null) => {
    const result: R[] = [];
    for (const iterator of object) {
        const value = callback(iterator);
        if (value != null) result.push(value)
    }
    return result
}


/**
 * 对象转换成FormData
 * @param  {any} obj
 * @param  {FormData} form?
 * @param  {string} namespace?
 */
export const objectToFormData = (obj: any, form?: FormData, namespace?: string): FormData => {
    const fd = form || new FormData();
    let formKey;
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + "[" + property + "]";
            } else {
                formKey = property;
            }
            // if the property is an object, but not a File, use recursivity.
            if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
                objectToFormData(obj[property], fd, property);
            } else {
                // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }
        }
    }
    return fd;
}


/**
 *  对比两个对象多个指定属性是否相等
 * @param  {(keyofT)[]} keys
 */
export const equal = <T extends Record<string, any>>(keys: (keyof T)[], cb?: (obj1?: T, obj2?: T) => void) => (obj1: T | undefined, obj2: T | undefined) => {

    if (isEmpty(obj1) || isEmpty(obj2)) return false

    for (const key of keys) {
        if (obj1[key] !== obj2[key]) return false
    }
    cb?.(obj1, obj2)
    return true
}

/**
 * 路径拼接
 * @param  {string[]} ...args
 */
export const pathJoin = (...args: string[]) => {
    return args.join('/').replace(/\/+/g, '/');
}