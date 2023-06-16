import { Alert } from "#components"
import { MessageServiceFormatOption } from "."

export const messageProps = {
    option: { type: Object as PropType<MessageServiceFormatOption>, required: true }
}

export const messageEmits = {
    close: () => true
}

export default defineComponent({
    name: "Message",
    props: messageProps,
    emits: messageEmits,
    setup(props, { emit }) {

        let closeTimer: number | null | NodeJS.Timeout = null

        const styles = { zIndex: nextIndex() }

        const close = props.option!.close = () => {
            emit("close")
            props.option!.onClose?.()
        }

        const handler = {
            onClick: (e: MouseEvent) => {
                props.option!.onClick?.(e)
            },
            onClickCloseIcon: () => {
                close()
            },
            onMouseenter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                }
            },
            onMouseleave: () => {
                !!props.option!.time && (closeTimer = setTimeout(close, props.option!.time))
            }
        }

        onMounted(() => !!props.option!.time && (closeTimer = setTimeout(close, props.option!.time)))

        const stylees = computed(() => {
            switch (props.option?.position) {
                case "left":
                    return "justify-content:flex-start"
                case "right":
                    return "justify-content:flex-end"
                default:
                    return "justify-content:center"
            }
        })

        return () => (
            <div class="pointer-events-none flex w-full" style={stylees.value}>
                <div class="pointer-events-auto min-w-xs max-w-xl" style={styles} onMouseenter={handler.onMouseenter} onMouseleave={handler.onMouseleave} onClick={handler.onClick}>
                    <Alert status={props.option?.status} class=" shadow-lg " showClose={false} modelValue={true}>
                        {{
                            context: props.option!.render,
                            default: () => props.option!.message
                        }}
                    </Alert>
                </div>
            </div>

        )
    }
})