
import { ExtractPropTypes } from "nuxt/dist/app/compat/capi";
import Arrow, { arrowProps } from "./CarouselArrow";
import Indicator from "./CarouselIndicator";
import { useEventListener, useModel } from "@lemonpeel2/hooks";
import { debounce } from "lodash";

export const carouselProps = {
    vertical: Boolean,
    center: Boolean,
    end: Boolean,
    carouselClassName: String,
    full: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: Number,
        default: 0
    },
    ...arrowProps,
}

export const carouselEmits = {
    'update:modelValue': (value: number) => true
}

export const carouselInjectToken: InjectionKey<ExtractPropTypes<typeof carouselProps> & { onMounted: () => void, onUnmounted: () => void }> = Symbol('carousel');

export default defineComponent({
    name: 'Carousel',
    props: carouselProps,
    emits: carouselEmits,
    setup(props, { emit }) {

        const container = ref<null | HTMLElement>(null);

        const model = useModel(() => props.modelValue, (value) => emit('update:modelValue', value));

        const indicatorCount = ref(0);

        const methods = {
            scrollTo: (index: number) => {
                if (!container.value) return;

                const itemWidth = container.value.offsetWidth;

                container.value.scrollTo({
                    left: index * itemWidth,
                    behavior: 'smooth'
                });

                model.value = index;
            },
            scrollListener() {
                if (!container.value) return;

                const scrollLeft = container.value?.scrollLeft || 0;
                const itemWidth = (container.value?.children[0] as HTMLElement)?.offsetWidth || 0;

                model.value = Math.floor((scrollLeft + itemWidth / 2) / itemWidth)
            }
        }

        const handler = {
            onMounted: () => {
                indicatorCount.value++;
            },
            onUnmounted: () => {
                indicatorCount.value--;
            },
            onNext: () => {
                // 如果当前是最后一个
                if (model.value === indicatorCount.value - 1) {
                    methods.scrollTo(0);
                    return;
                }
                methods.scrollTo(model.value + 1);
            },
            onPrev: () => {
                // 果然是第一个
                if (model.value === 0) {
                    methods.scrollTo(indicatorCount.value - 1);
                    return;
                }
                methods.scrollTo(model.value - 1);
            },
            onChange: (index?: number) => {
                methods.scrollTo(index ?? 0);
            }
        }


        onMounted(() => {
            methods.scrollTo(model.value);
            useEventListener('scroll', debounce(methods.scrollListener, 100), { target: container.value })
        });

        provide(carouselInjectToken, { ...props, onMounted: handler.onMounted, onUnmounted: handler.onUnmounted });

        const classes = computed(() => splicing([
            'h-full',
            'carousel',
            {
                'carousel-vertical': props.vertical,
                'carousel-center': props.center,
                'carousel-end': props.end,
            },
            props.carouselClassName
        ]))

        return {
            classes,
            indicatorCount,
            container,
            model,
            ...handler,
        }
    },
    render() {
        return (
            <div class="relative">
                <div class="relative group">
                    <div ref={(refs: any) => this.container = refs} class={this.classes}>
                        {this.$slots.default?.()}
                    </div>
                    <Arrow onNext={this.onNext} onPrev={this.onPrev} arrow={this.$props.arrow} />
                </div>
                <Indicator index={this.model} onChange={this.onChange} count={this.indicatorCount} />
            </div>
        )
    }
})