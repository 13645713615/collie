
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { useUserStore } from '~/store/user';

interface RequestOptions<R extends NitroFetchRequest> extends NitroFetchOptions<R> {
    isToken?: boolean;
}

export interface RespResusl<T = unknown> {
    status: number;
    data: T;
    message?: string;
    ext?: any;
}

export const request = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest, O extends RequestOptions<R> = RequestOptions<R>>(url: R, options?: O) => {
    const { isToken, onRequestError, ...opts } = options || {} as O;

    const { reject, resolve, result } = contract<RespResusl<T>>();

    const token = toRef(useUserStore(), "token")
    
    // ofetch对params选项的定位是和query一样的作用，功能重复，所以这里做了一下兼容
    if (opts?.params && typeof opts.params === 'object' && typeof url === "string") {
        for (const [key, val] of Object.entries(opts.params)) {
            if (['string', 'number'].includes(typeof val))
                url = (url as string).replaceAll(`:${key}`, String(val)) as any
        }
        // 如果不删除`opts.params`，则会请求一个`/api/commit/5?id=5`的接口
        delete opts.params
    }

    $fetch<RespResusl<T>, R, NitroFetchOptions<R>>(url, {
        baseURL: useRuntimeConfig().public.apiBase,
        onRequest(content) {
            const { options } = content;

            options.headers = (options.headers || {}) as Record<string, string>;

            if (isToken) {
                if (token.value) {
                    options.headers['Authorization'] = `Bearer ${token.value}`
                } else {
                    const error = Error('Token is empty')
                    this.onRequestError?.({ ...content, error })
                    throw error
                }
            }
        },
        onRequestError(context) {
            unref(onRequestError)?.(context)
            reject({ status: 500, message: context.error.message })
        },
        onResponse(context) {
            if (context.response.ok === true) {
                resolve(context.response._data)
            } else {
                reject(context.response._data)
            }
        },
        ...opts,
    })
    return result
}