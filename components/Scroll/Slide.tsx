import { useWatchOnce } from "@lemonpeel2/hooks";
import { scrollInjectToken } from "."


export default defineComponent({
    name: 'ScrollSlide',
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 3000
        },
        speed: {
            type: Number,
            default: 400
        },
        listenFlick: {
            type: Boolean,
            default: true
        },
        threshold: {
            type: Number,
            default: 0.1
        }
    },
    emits: {
        pullDown: (_next: () => void) => true
    },
    setup(props, { emit }) {

        const scroll = inject(scrollInjectToken);


        const handler = {
            onScrollEnd() {
                let pageIndex = scroll?.bs.value?.getCurrentPage().pageY
            }
        }

        const methods = {
            insatall() {
                scroll?.use({
                    momentum: false,
                    bounce: false,
                    stopPropagation: true,
                    slide: {
                        loop: props.loop,
                        autoplay: props.autoplay,
                        interval: props.interval,
                        speed: props.speed,
                        listenFlick: props.listenFlick,
                        threshold: props.threshold,
                    }
                })
            },
            bind() {
                methods.unbind();
                scroll?.bs.value
                    ?.on('scrollEnd', handler.onScrollEnd)
            },
            unbind() {
                scroll?.bs.value
                    ?.off('scrollEnd', handler.onScrollEnd)
            },
        }

        methods.insatall()

        useWatchOnce(() => scroll?.bs.value, () => methods.bind())

        onUnmounted(methods.unbind)

    },
    render() {
        return this.$slots.default?.().map((vnode) => h(vnode, { class: 'slide-page', style: 'backface-visibility: hidden;transform: translate3d(0,0,0)' }))
    }
})