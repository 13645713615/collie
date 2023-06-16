import { reduce } from "lodash"
import * as select from "~/api/select"
import { SelectList } from "~/types/entity"


export const useSelectData =  (key: keyof typeof select) => {

    const { public: { apiBase } } = useRuntimeConfig()

    const state =  useAsyncData(key, select[key], {
        default: () => new Map<number, SelectList>(),
        transform: res =>
            reduce(res.data, (prev, curr) => {
                curr.image &&= apiBase + curr.image;
                prev.set(curr.value, curr)
                return prev
            }, new Map<number, SelectList>())
    })

    return {
        ...state,
        getValue<T extends keyof SelectList>(value: number | undefined, key: T): SelectList[T] | undefined {
            if (value == undefined) return;
            return state.data.value?.get(value)?.[key]
        }
    }
}