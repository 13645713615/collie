import { LoadingSpin, LoadingBouncing } from "#components"

const loadingProps = {
    loading: {
        type: Boolean,
        default: false
    },
    type: {
        type: String as PropType<"spin" | "bouncing">,
        default: "spin"
    }
}

export default defineComponent({
    name: 'Loading',
    props: loadingProps,
    setup(props, { attrs }) {

        const isSwitch = ref<boolean>(props.loading);

        let timer: NodeJS.Timeout | null = null;

        const methods = {
            start: () => {
                timer = setTimeout(() => {
                    isSwitch.value = true;
                }, 300)
            },
            stop: () => {
                clearTimeout(timer!);
                isSwitch.value = false;
            }
        }

        watch(() => props.loading, (value) => value ? methods.start() : methods.stop())

        return () => props.type === "spin" ? <LoadingSpin {...attrs} loading={isSwitch.value} /> : <LoadingBouncing {...attrs} loading={isSwitch.value} />
    }
})

