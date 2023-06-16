import { createGlobalState } from "@lemonpeel2/hooks"
import { VNode, ExtractPropTypes } from "nuxt/dist/app/compat/capi"
import { buttonProps } from "~/components/Button"

export interface ButtonNode extends Partial<ExtractPropTypes<typeof buttonProps>>, Record<string, any> {
    key: string
    context: string | (() => VNode)
}

type ButtonState = Array<ButtonNode | null>

/**
 * 按钮状态
 */
export const useButtonState = createGlobalState(() => {

    const state = ref<ButtonState>([]);

    return {
        state: computed(() => state.value),
        setState(value?: ButtonState | ((value: ButtonState) => void)) {
            if (typeof value === 'function') {
                value(state.value)
            } else if (value) {
                state.value = value
            }
            return state.value
        }
    }
})

/**
 * 定义按钮
 * @param  {ButtonNode[]} data?
 * @param  {boolean} append?
 */
export const useDefineButton = (data?: ButtonNode[], append?: boolean) => {

    const { state, setState } = useButtonState()

    const stateMark = computed<Map<string, number>>(() => state.value.reduce((p, c, i) => {
        if (c) p.set(c.key, i)
        return p
    }, new Map()));


    const updateState = (data: Map<string, number>, cb: (key: string, value: number) => ButtonNode | null) => {
        setState((value) => {
            data.forEach((i, k) => {
                const index = stateMark.value.get(k);
                if (index) {
                    value[index] = cb(k, i)
                }
            })
        })
    }


    /**
     * 定义按钮
     * @param  {ButtonNode[]} data
     */
    const defineButton = (data: ButtonNode[]) => {

        if (process.server) return;

        onActivated(() => setState(data))
        onDeactivated(() => setState([]))
        onUnmounted(() => setState([]))
    }


    /**
     * 追加按钮
     * @param  {ButtonNode[]} data
     */
    const appendButton = (data: ButtonNode[]) => {

        if (process.server) return;

        const mark = new Map(data.map((node, index) => [node.key, index]))

        setState((value) => {
            mark.forEach((i, k) => {
                const index = stateMark.value.get(k);
                if (index) {
                    value[index] = data[i]
                } else {
                    value.push(data[i])
                }
            })
        })
        //  用onBeforeRouteLeave 代替 onUnmounted, 保证页面离开时，按钮状态被清除，而不是改变路由参数清除
        onBeforeRouteLeave(() => updateState(mark, () => null))
    }

    if (data) append ? appendButton(data) : defineButton(data)

    return { defineButton, appendButton, stateMark, state }
}
