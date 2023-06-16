import { useModel, useLoadDemand } from "@lemonpeel2/hooks"
import { Teleport } from "vue";
import Button from "./Button";

export const modalProps = {
    showCloseBtn: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: Boolean
    },
    mobile: {
        type: Boolean,
    },
}


export const modalEmits = {
    "update:modelValue": (_value?: boolean) => true,
    clear: (_e: MouseEvent) => true,
    esc: (_e: KeyboardEvent) => true,
}

export default defineComponent({
    name: "Modal",
    props: modalProps,
    emits: modalEmits,
    inheritAttrs: false,
    setup(props, { emit, slots }) {

        const model = useModel(() => props.modelValue, (value) => emit("update:modelValue", value), { wait: 0 });

        const classes = computed(() => splicing([
            "modal",
            {
                "modal-open": model.value,
                'modal-bottom sm:modal-middle': props.mobile
            }
        ]))

        const { state: defaultRender } = useLoadDemand(model, () => slots.default)

        const methods = {
            show: () => {
                model.value = true
            },
            hide: () => {
                model.value = false
            }
        }

        const handle = {
            onClose: async (e: MouseEvent) => {
                emit("clear", e);
                methods.hide()
            }
        }

        return {
            classes,
            defaultRender,
            handle,
        }

    },
    render() {
        return (
            <Teleport to="body">
                <div class={this.classes}>
                    <div class="modal-box relative" {...this.$attrs}>
                        {this.showCloseBtn && <Button onClick={this.handle.onClose} size="sm" circle class="absolute right-2 top-2">x</Button>}
                        {this.defaultRender?.()}
                        {
                            this.$slots.action && (
                                <div class="modal-action">
                                    {this.$slots.action?.()}
                                </div>
                            )
                        }
                    </div>
                </div>
            </Teleport>
        )
    }
})