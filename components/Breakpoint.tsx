import { ClientOnly } from "#components"
import { useBreakpoints } from "@lemonpeel2/hooks";
import { Slot } from "nuxt/dist/app/compat/capi";
import { TDefineBreakpoints, TDefineBreakpointsKeys } from "~/utils/breakpoints";

export default defineComponent({
    name: 'Breakpoint',
    inheritAttrs: false,
    setup(_, { slots, attrs }) {

        const breakpoints: TDefineBreakpoints<Slot | undefined> = {}

        for (const key in slots) {
            if (Object.prototype.hasOwnProperty.call(slots, key)) {
                // 不能在setup中使用render函数，因为render函数是在render函数中执行的
                // slots[key]?.();
                breakpoints[key as TDefineBreakpointsKeys] = () => slots[key];
            }
        }

        const { define } = useBreakpoints();

        const ChatContext = define(breakpoints)

        return () => (
            <ClientOnly>
                {ChatContext.value?.(attrs)}
            </ClientOnly>
        )
    }
})
