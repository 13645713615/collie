import { useTimer } from "@lemonpeel2/hooks";
import Button, { buttonProps } from "./Button";

export default defineComponent({
    name: "SendButton",
    props: {
        ...buttonProps,
        frequency: {
            type: Number,
            default: 1000
        },
        times: {
            type: Number,
            default: 60
        }
    },
    emits: {
        send: (_next: (status?: boolean) => void) => true
    },
    setup(props, { emit }) {

        const { t } = useI18n()

        const loading = ref(false);

        const index = ref(0);

        const text = computed(() => index.value <= 0 ? t("components.sendButton.button.send") : t("components.sendButton.button.locking", { time: index.value }))

        function next(status?: boolean) {
            status = status ?? true;
            loading.value = false;
            if (status) methods.start();
        }

        const methods = {
            send: () => {
                loading.value = true;
                emit('send', next)
            },
            start: () => {
                useTimer((i) => index.value = props.times - i, { endTime: props.frequency * props.times, immediate: true });
            }
        }

        const handle = {
            onSend: (e: Event) => {
                e.stopPropagation();
                methods.send()
            }
        }

        const publicProps = computed<Record<string, any>>(() => ({
            ...props,
            htmlType: "button",
            class: "px-0",
            loading: loading.value,
            disabled: index.value > 0,
            onClick: handle.onSend
        }))


        return () => (<Button {...publicProps.value}>{text.value}</Button>)
    }
})