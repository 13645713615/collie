import { useModel } from "@lemonpeel2/hooks";

export const drawerProps = {
    mobile: {
        type: Boolean,
    },
    end: {
        type: Boolean,
    },
    modelValue: {
        type: Boolean
    },
    maxHeight: {
        type: String,
        default: "100vh"
    }
}

export const drawerEmits = {
    "update:modelValue": (_value?: boolean) => true,
}

export default defineComponent({
    name: 'Drawer',
    props: drawerProps,
    emits: drawerEmits,
    setup(props, { emit }) {

        const model = useModel(() => props.modelValue, emit.bind(null, "update:modelValue"));

        const classes = computed(() => splicing([
            'drawer',
            {
                'drawer-mobile': props.mobile,
                'drawer-end': props.end,
            }
        ]))


        const methods = {
            close() {
                model.value = false;
            },
            open() {
                model.value = true;
            }
        }

        const handle = {
            onClose() {
                methods.close();
            }
        }

        return { methods, handle, model, classes }
    },
    render() {
        return (
            <div class={this.classes}>
                <input checked={this.model} type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">
                    {this.$slots.default?.()}
                </div>
                <div class="drawer-side" style={{ maxHeight: this.$props.maxHeight }}>
                    <div class="drawer-overlay" onClick={this.handle.onClose}></div>
                    {this.$slots.side?.()}
                </div>
            </div>
        )
    }
})