import { useModel } from "@lemonpeel2/hooks";
import { InjectionKey } from "nuxt/dist/app/compat/capi"
import type { RouteLocationRaw } from 'vue-router';

export const menuProps = {
    align: {
        type: String as PropType<"horizontal" | "vertical">,
        default: "vertical"
    },
    compact: {
        type: Boolean
    },
    rounded: {
        type: Boolean
    },
    modelValue: {
        type: [String, Number]
    }
}

export const menuEmits = {
    "update:modelValue": (_value?: string | number) => true,
    change: (_value?: string | number) => true
}

type MenuInject = {
    onChange: (name: string | number, to?: string | RouteLocationRaw, isReplace?: boolean) => void;
    activeName: Ref<string | number | undefined>;
}

export const menuInjectToken: InjectionKey<MenuInject> = Symbol('menu');

export default defineComponent({
    name: 'Menu',
    props: menuProps,
    emits: menuEmits,
    setup(props, { slots, emit }) {

        const { push, replace } = useRouter()

        const model = useModel(() => props.modelValue, (value) => emit('update:modelValue', value), { wait: 0 })

        const classes = computed(() => splicing([
            "menu",
            {
                [`menu-${props.align}`]: props.align,
                'menu-compact': props.compact,
            }
        ]))

        const handler = {
            onChange: (name: string | number, to?: string | RouteLocationRaw, isReplace?: boolean) => {
                model.value = name;
                emit('change', model.value)
                if (to) {
                    isReplace ? replace(to) : push(to);
                }
            }
        }

        provide(menuInjectToken, {
            onChange: handler.onChange,
            activeName: computed(() => model.value)
        })

        return () => (
            <ul class={classes.value}>
                {slots.default?.()}
            </ul>
        )
    }
})