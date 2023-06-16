import { useWatchOnce } from "@lemonpeel2/hooks";
import { scrollInjectToken } from "."
import { LoadingSpin, Swap } from "#components";

enum PullDownStatus {
    enter = 'enter',
    leave = 'leave',
    fetching = 'fetching',
    succeed = 'succeed',
}

export default defineComponent({
    name: 'ScrollPullDow',
    props: {
        threshold: {
            type: Number,
            default: 50
        },
        stop: {
            type: Number,
            default: 48
        },
        disabled: {
            type: Boolean,
        }
    },
    emits: {
        pullDown: (_next: () => void) => true
    },
    setup(props, { emit }) {

        const pullDownStatus = ref<PullDownStatus | null>(null);

        const scroll = inject(scrollInjectToken);

        const pullDownContext = computed(() => pullDownStatus.value && methods.pullDownContext(pullDownStatus.value));

        const handler = {
            onPullingDown() {
                pullDownStatus.value = PullDownStatus.fetching
                emit('pullDown', methods.pullingDownNext)
            },
            onEnterThreshold() {
                if (scroll!.bs.value!.y < 0) return
                pullDownStatus.value = PullDownStatus.enter
            },
            onLeaveThreshold() {
                if (scroll!.bs.value!.y < 0) return
                pullDownStatus.value = PullDownStatus.leave
            }
        }

        const methods = {
            insatall() {
                scroll?.use({
                    pullDownRefresh: {
                        threshold: props.threshold,
                        stop: props.stop,
                    }
                })
            },
            bind() {
                methods.unbind();
                scroll?.bs.value
                    ?.on('pullingDown', handler.onPullingDown)
                    .on('enterThreshold', handler.onEnterThreshold)
                    .on('leaveThreshold', handler.onLeaveThreshold)
            },
            unbind() {
                scroll?.bs.value
                    ?.off('pullingDown', handler.onPullingDown)
                    ?.off('enterThreshold', handler.onEnterThreshold)
                    ?.off('leaveThreshold', handler.onLeaveThreshold)
            },
            pullingDownNext() {
                pullDownStatus.value = PullDownStatus.succeed
                scroll?.bs.value?.finishPullDown()
                setTimeout(() => {
                    scroll?.bs.value?.refresh()
                }, (scroll?.state.bounceTime ?? 0) + 50)
            },
            pullDownContext(status: PullDownStatus) {
                switch (status) {
                    case PullDownStatus.enter:
                    case PullDownStatus.leave:
                        return (
                            <Swap animation="rotate" modelValue={status === PullDownStatus.enter}>
                                {{
                                    default: () => <i class="i-mdi-arrow-down h-5 w-5 block"></i>,
                                    on: () => <i class="i-mdi-arrow-up h-5 w-5 block"></i>,
                                }}
                            </Swap>
                        )
                    case PullDownStatus.fetching:
                    case PullDownStatus.succeed:
                        return (<LoadingSpin loading={status === PullDownStatus.fetching} />)
                    default:
                        return null
                }
            }
        }

        methods.insatall()

        useWatchOnce(() => scroll?.bs.value, () => !props.disabled && methods.bind())

        onUnmounted(methods.unbind)

        watch(() => props.disabled, (disabled) => disabled ? methods.unbind() : methods.bind())

        return {
            pullDownContext
        }

    },
    render() {
        return (
            <div class="w-full absolute translate-y--100% text-center py-4">
                {this.pullDownContext}
            </div>
        )
    }
})