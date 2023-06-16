import { ButtonHTMLAttributes } from "nuxt/dist/app/compat/capi"
import type { RouteLocationRaw } from 'vue-router';

export const buttonProps = {
    type: String as PropType<"primary" | "secondary" | "accent" | "info">,
    status: String as PropType<"info" | "success" | "warning" | "error">,
    size: String as PropType<"lg" | "md" | "sm" | "xs">,
    htmlType: {
        type:String as PropType<"button" | "submit" | "reset">,
        default: "button"
    },
    noAnimation: Boolean,
    outline: Boolean,
    ghost: Boolean,
    square: Boolean,
    circle: Boolean,
    loading: Boolean,
    disabled: Boolean,
    wide: Boolean,
    block: Boolean,
    link: Boolean,
    wrap: Boolean,
    name: String,
    active: Boolean,
    to: [String, Object] as PropType<string | RouteLocationRaw>,
    replace: Boolean,
}

export const buttonEmits = {
    click: (e: MouseEvent) => true,
}

export default defineComponent({
    name: "Button",
    props: buttonProps,
    emits: buttonEmits,
    slots: ["default"],
    setup(props, { slots, emit }) {

        const renderSlots = useRenderSlots()

        const { replace, push } = useRouter()

        const classes = computed(() => splicing([
            "btn",
            {
                'btn-link': props.link,
                'btn-disabled': props.disabled,
                'btn-ghost': props.ghost,
                'btn-outline': props.outline,
                'btn-square': props.square,
                'btn-circle': props.circle,
                'loading before:!animate-duration-2000': props.loading,
                'btn-wide': props.wide,
                'btn-block': props.block,
                'no-animation': props.noAnimation,
                'btn-active': props.active,
                /**
                btn-info
                btn-success
                btn-warning
                btn-error
                */
                [`btn-${props.status}`]: !!props.status,
                /**
                 btn-primary
                btn-secondary
                btn-accent
                btn-info
                */
                [`btn-${props.type}`]: !!props.type,
                /**
                btn-lg
                btn-md
                btn-sm
                btn-xs
                */
                [`btn-${props.size}`]: typeof props.size === "string"
            }
        ]))

        const publicProps = computed<ButtonHTMLAttributes>(() => ({
            name: props.name,
            class: classes.value,
            type: props.htmlType,
            onClick: (e: MouseEvent) => {
                if (props.disabled) {
                    return e.preventDefault();
                }
                if (props.to) {
                    props.replace ? replace(props.to) : push(props.to);
                    return;
                }
                emit('click', e);
            },
        }))

        return () => props.wrap ?
            renderSlots("default", publicProps.value) :
            <button  {...publicProps.value}>{slots.default?.()}</button>

    }
})