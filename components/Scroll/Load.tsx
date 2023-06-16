import { LoadingSpin } from "#components";
import { useWatchOnce } from "@lemonpeel2/hooks";
import { scrollInjectToken } from ".";
import { PropType } from "nuxt/dist/app/compat/capi";
import { debounce } from "lodash";

export default defineComponent({
    name: 'ScrollLoad',
    props: {
        position: {
            type: String as PropType<'top' | 'bottom'>,
            default: 'top'
        },
        threshold: {
            type: Number,
            default: 20
        },
        disabled: {
            type: Boolean,
        }
    },
    emits: {
        load: (_next: () => void) => true
    },
    setup(props, { emit }) {

        let pulling: boolean = false;

        const loading = ref<boolean>(false);

        const scroll = inject(scrollInjectToken);

        const isMobile = useIsMobileSize()

        const classes = computed(() => splicing([
            'w-full h-10 flex justify-center items-center',
            {
                'absolute': !loading.value,
            }
        ]))

        const handler = {
            onScroll: debounce((e: Record<"y" | "x", number>) => {

                if (pulling) return;

                const maxScrollY = scroll?.bs.value?.maxScrollY ?? 0

                if (props.position === "top" && e.y > props.threshold) {
                    methods.checkPull("top")
                } else if (props.position === "bottom" && Math.abs(e.y - maxScrollY) > props.threshold) {
                    methods.checkPull("bottom")
                }
            }, 50, { maxWait: 500 }),
        }

        const methods = {
            insatall() {
                scroll?.use({
                    useTransition: isMobile.value,
                    probeType: !isMobile.value ? 3 : 1,
                })
            },
            bind() {
                methods.unbind();
                scroll?.bs.value?.on("scroll", handler.onScroll)
            },
            unbind() {
                scroll?.bs.value
                    ?.off('scroll', handler.onScroll)
            },
            setBounceThreshold() {
                if (scroll?.bs.value?.options.bounce) {
                    scroll?.bs.value?.options.bounce
                }
            },
            checkPull(position: 'top' | 'bottom') {
                const bs = scroll?.bs.value;

                pulling = true;

                if (position == "top") {
                    emit('load', methods.loadingNext.bind(null, bs?.maxScrollY))
                } else {
                    emit('load', methods.loadingNext)
                }

                loading.value = true;

                nextTick(() => {
                    bs?.stop();
                    scroll?.refresh();
                })
            },
            correctScrollY(oldMaxScrollY: number) {
                if (!scroll?.bs.value) return;

                const bs = scroll.bs.value,
                    maxScrollY = bs.maxScrollY ?? 0,
                    y = bs.y ?? 0,
                    scrollY = maxScrollY - oldMaxScrollY + (y > 0 ? 0 : y);

                bs.scrollTo(0, scrollY, 0)
            },
            loadingNext(oldMaxScrollY: number = 0) {
                loading.value = false;

                nextTick(() => {
                    scroll?.bs.value?.stop();
                    scroll?.refresh();
                    if (props.position === 'top') methods.correctScrollY(oldMaxScrollY);
                    pulling = false;
                })
            },
        }

        useWatchOnce(() => scroll?.bs.value, () => !props.disabled && methods.bind())

        onUnmounted(methods.unbind)

        watch(() => props.disabled, (disabled) => disabled ? methods.unbind() : methods.bind())

        return {
            loading,
            classes
        }
    },
    render() {
        return (
            <div class={this.classes}>
                <LoadingSpin loading={this.loading} />
            </div>
        )
    }
})