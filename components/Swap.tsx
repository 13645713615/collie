
import { useModel } from "@lemonpeel2/hooks"

export const swapProps = {
    animation: {
        type: String as PropType<"rotate" | "flip">
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
    }
}

export const swapEmits = {
    "update:modelValue": (_value?: boolean) => true,
}

export default defineComponent({
    name: 'Swap',
    props: swapProps,
    emits: swapEmits,
    setup(props, { slots, emit }) {

        const model = useModel(() => props.modelValue, emit.bind(null, "update:modelValue"), { wait: 0 });

        const classes = computed(() => splicing([
            "swap",
            {
                'swap-active': model.value,
                'swap-rotate': props.animation === "rotate",
                'swap-flip': props.animation === "flip",
            }
        ]))

        return () => (
            <label class={classes.value}>
                <input type="checkbox" disabled={props.disabled} v-model={model.value} />
                <div class="swap-on">
                    {slots.on?.()}
                </div>
                <div class="swap-off">
                    {slots.default?.()}
                </div>
            </label>
        )
    }
})