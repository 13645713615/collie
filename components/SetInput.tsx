import { useModel } from "@lemonpeel2/hooks";
import { Button } from "#components";

export default defineComponent({
    name: "SetInput",
    props: {
        modelValue: {
            type: [String, Number]
        },
        saveText: {
            type: String,
            default: "保存"
        },
        cancelText: {
            type: String,
            default: "取消"
        }
    },
    emits: {
        "update:modelValue": (_value?: string | number) => true,
        "change": (_next: (bool?: boolean) => void, _value?: string | number) => true
    },
    inheritAttrs: false,
    setup(props, { emit }) {

        const model = useModel(() => props.modelValue);

        const loading = ref<boolean>(false);

        const isChange = computed<boolean>(() => !model.value || props.modelValue === model.value);

        const methods = {
            change(bool?: boolean) {
                if (bool === true || bool === undefined) {
                    emit("update:modelValue", model.value)
                }
                loading.value = false;
            }
        }

        const handler = {
            onCancel: () => {
                model.value = props.modelValue
            },
            onSave: () => {
                loading.value = true;
                emit("change", methods.change, model.value)
            },
            onEnter: (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !loading.value) {
                    handler.onSave()
                }
            }
        }

        return { isChange, handler, model, loading }

    },
    render() {
        return (
            <div class="relative">
                <input class="input input-bordered w-full prevent" {...this.$attrs} v-model={this.model} onKeyup={this.handler.onEnter} />
                <div class={`absolute top-2/4 right-3 -mt-4 space-x-1 ${this.isChange && !this.loading && 'hidden'}`}>
                    <Button size="sm" onClick={this.handler.onCancel} ghost>{this.cancelText}</Button>
                    <Button size="sm" loading={this.loading} onClick={this.handler.onSave}>{this.saveText}</Button>
                </div>
            </div>
        )
    }
})