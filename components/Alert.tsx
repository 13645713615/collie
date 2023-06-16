import { useModel } from "@lemonpeel2/hooks";
import Button from "./Button";
import { Transition } from "vue";

export const alertProps = {
    status: String as PropType<"info" | "success" | "warning" | "error">,
    modelValue: {
        type: Boolean,
        default: true
    },
    showIcon: {
        type: Boolean,
        default: true
    },
    showClose: {
        type: Boolean,
        default: true
    }
}

export const alertEmits = {
    "update:modelValue": (_value?: boolean) => true,
    close: () => true,
}

export default defineComponent({
    name: "Alert",
    props: alertProps,
    emits: alertEmits,
    setup(props, { emit }) {

        const model = useModel(() => props.modelValue, (value) => emit("update:modelValue", value), { wait: 100 });

        const classes = computed(() => splicing([
            'alert',
            {
                /* 
                alert-info	
                alert-success 	
                alert-warning	
                alert-error	
                */
                [`alert-${props.status}`]: !!props.status,
            }
        ]))


        const icon = computed<string | undefined>(() => {
            if (props.showIcon == false) return;
            switch (props.status) {
                case "error":
                    return "i-mdi-alert-circle-outline"
                case "info":
                    return "i-mdi-information-outline"
                case "success":
                    return "i-mdi-check-circle-outline"
                case "warning":
                    return "i-mdi-alert-outline"
            }
        })

        const methods = {
            close() {
                model.value = false;
                emit("close");
            },
            open() {
                model.value = true;
            }
        }

        const handler = {
            onClose() {
                methods.close();
            }
        }

        return { methods, handler, model, classes, icon }
    },
    render() {
        return (
            <Transition leaveActiveClass="animate-zoom-out animate-duration-300" enterActiveClass="animate-bounce-in animate-duration-500">
                <div v-show={this.model} class={this.classes}>
                    {
                        this.$slots.context ? this.$slots.context() : [
                            <div>
                                {this.$props.showIcon && this.icon && <i class={`${this.icon} w-6 h-6 block`}></i>}
                                <span>{this.$slots.default?.()}</span>
                            </div>,
                            this.$props.showClose && <div class="flex-none !my-0">
                                <Button size="sm" class="!p-0" ghost circle onClick={this.handler.onClose}>
                                    <i class="i-mdi-close w-4 h-4 block"></i>
                                </Button>
                            </div>
                        ]
                    }
                </div>
            </Transition>
        )
    }
})