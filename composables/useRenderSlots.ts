import { VNodeProps, createVNode } from "vue";

type Data = Record<string | number | symbol, any>;

export const useRenderSlots = () => {
    const { slots } = getCurrentInstance()!
    const renderSlots = (name: string) => {
        const slot = slots[name]
        if (slot) {
            return slot()
        }
        return null
    }
    return (name: string, props?: (VNodeProps & Data) | null) => {
        const node = renderSlots(name);
        if (props && node?.length) {
            const [first, ...other] = node;
            return [createVNode(first, props), ...other]
        } else {
            return node
        }
    }
}