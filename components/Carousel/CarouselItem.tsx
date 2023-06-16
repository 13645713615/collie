import { carouselInjectToken } from "."

export default defineComponent({
    name: "CarouselItem",
    setup() {
        const carousel = inject(carouselInjectToken);

        const classes = computed(() => splicing([
            'carousel-item',
            {
                'w-full': carousel?.full,
            }
        ]))

        carousel?.onMounted?.();

        onBeforeUnmount(() => {
            carousel?.onUnmounted();
        })

        return {
            classes
        }
    },
    render() {
        return (
            <div class={this.classes}>
                {this.$slots.default?.()}
            </div>
        )
    }
})