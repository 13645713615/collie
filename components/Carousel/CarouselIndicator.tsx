
const IndicatorProps = {
    count: {
        type: Number,
        default: 0
    },
    index: {
        type: Number,
    }
}

const IndicatorEmits = {
    change: (value?: number) => true
}

export default defineComponent({
    name: 'CarouselIndicator',
    props: IndicatorProps,
    emits: IndicatorEmits,
    setup(props, { emit }) {

        const handler = {
            onClick: (index: number) => {
                emit("change", index)
            }
        }

        return () => (
            <ul class="flex justify-center space-x-2 h-11 items-center">
                {
                    Array.from({ length: props.count }).map((_, i) => <li onClick={handler.onClick.bind(null, i)} key={i} class={`${ props.index == i ? 'bg-primary' : '' } cursor-pointer h-3 bg-base-content/50 w-3 block rounded-full`}></li>)
                }
            </ul>
        )
    }
})