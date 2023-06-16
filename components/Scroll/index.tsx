import BScroll, { Options } from '@better-scroll/core'
import MouseWheel, { MouseWheelOptions } from '@better-scroll/mouse-wheel'
import ScrollBar, { ScrollbarOptions } from '@better-scroll/scroll-bar'
import { ExtractPropTypes, PropType } from 'nuxt/dist/app/compat/capi'
import { debounce } from 'lodash'
import { useEventListener } from '@lemonpeel2/hooks'
// import ObserveDOM from '@better-scroll/observe-dom'
import PullDown from '@better-scroll/pull-down'
import Slide from '@better-scroll/slide'

BScroll.use(PullDown)
// BScroll.use(ObserveDOM)
BScroll.use(MouseWheel)
BScroll.use(ScrollBar)
BScroll.use(Slide)

type ScrollInject = {
    use: (opts: Options) => void;
    bs: ComputedRef<BScroll | undefined>;
    state: ExtractPropTypes<typeof scrollProps>
    refresh: () => void
}

export const scrollInjectToken: InjectionKey<ScrollInject> = Symbol('scroll');

export const scrollProps = {
    scrollY: {
        type: Boolean,
        default: true
    },
    scrollX: {
        type: Boolean,
    },
    scrollbar: {
        type: [Boolean, Object] as PropType<ScrollbarOptions>,
        default: true
    },
    bounceTime: {
        type: Number,
        default: 800
    },
    bounce: {
        type: [Boolean, Object] as PropType<Options['bounce']>,
        default: true
    },
    preventDefault: {
        type: Boolean,
        default: false
    },
    useTransition: {
        type: Boolean,
        default: true
    },
    mouseWheel: {
        type: [Boolean, Object] as PropType<MouseWheelOptions>,
        default: () => ({
            speed: 10,
            // throttleTime: 100,
            // dampingFactor: 0.1,
            // discreteTime: 300,
            // easeTime: 300,
        })
    },
    contentClassName: {
        type: String,
    }
}

export default defineComponent({
    name: 'Scroll',
    props: scrollProps,

    setup(props, { slots }) {

        const wrapper = ref<HTMLDivElement | undefined>()

        const scroll = ref<BScroll | undefined>()

        const replenishOptions = reactive<Options>({})

        const isMobile = useIsMobileSize()

        const options = computed<Options>(() => ({
            scrollY: props.scrollY,
            scrollX: props.scrollX,
            preventDefault: props.preventDefault,
            preventDefaultException: {
                className: /(^|\s)prevent(\s|$)/,
            },
            bounceTime: props.bounceTime,
            useTransition: props.useTransition,
            bounce: props.bounce,
            // observeDOM: true,
            scrollbar: props.scrollbar,
            mouseWheel: !isMobile.value ? props.mouseWheel : undefined,
            specifiedIndexAsContent: slots.before ? 1 : 0,
            ...replenishOptions
        }))

        const methods = {
            init(opts: Options) {
                if (!wrapper.value) return;
                scroll.value = new BScroll(wrapper.value, toRaw(opts))
                useEventListener("wheel", (event: Event) => event.preventDefault(), { target: wrapper.value })
            },
            use(opts: Options) {
                Object.assign(replenishOptions, opts)
            },
            refresh: debounce(() => scroll.value?.refresh(), 300, { leading: true, trailing: true }),
            scrollTo: (y: number, time?: number) => scroll.value?.scrollTo(0, y, time),
            // 滚动到顶部
            scrollToTop: (time?: number) => scroll.value?.scrollTo(0, 0, time),
            // 滚动到底部
            scrollToBottom: (time?: number) => scroll.value?.scrollTo(0, scroll.value.maxScrollY, time),
            // 获取当前位置
            getScrollY: () => scroll.value?.y,
            // 是否在底部
            isBottom: () => {
                if (!scroll.value) return false
                return Math.abs(scroll.value!.maxScrollY - scroll.value.y) > 10
            },
            scrollToElement: (el: HTMLElement | string, time: number = 300, offsetX: number | boolean = false, offsetY: number | boolean = false) => scroll.value?.scrollToElement(el, time, offsetX, offsetY),
        }

        provide(scrollInjectToken, {
            use: methods.use,
            bs: computed(() => scroll.value),
            state: props,
            refresh: methods.refresh
        })


        onMounted(() => {
            methods.init(options.value)
        })

        onUnmounted(() => scroll.value?.destroy())

        return {
            wrapper,
            methods
        }
    },
    render() {
        return (
            <div class="scroll-wrapper overflow-hidden relative" ref="wrapper">
                {this.$slots.before?.()}
                <div class={`scroll-content ${this.contentClassName}`}>
                    {this.$slots.default?.()}
                </div>
                {this.$slots.after?.()}
            </div>
        )
    }
})

