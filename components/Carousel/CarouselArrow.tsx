import { PropType } from "nuxt/dist/app/compat/capi";

export const arrowProps = {
    arrow: {
        type: String as PropType<'hover' | 'always' | 'never'>,
        default: 'hover'
    }
}
export const arrowEmits = {
    //下一个
    next: () => true,
    // 上一个
    prev: () => true
}

export default defineComponent({
    name: 'CarouselArrow',
    props: arrowProps,
    emits: arrowEmits,
    setup(props, { emit }) {

        const handler = {
            onNext: () => {
                emit('next')
            },
            onPrev: () => {
                emit('prev')
            }
        }

        const render = computed<JSX.Element>(() => {
            switch (props.arrow) {
                case 'hover':
                    return (
                        <div class="absolute !m-0 flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a onClick={handler.onPrev} class="btn  btn-circle shadow animate-fade-out-left opacity-0  !animate-duration-300  group-hover:opacity-100 group-hover:animate-fade-in-left">❮</a>
                            <a onClick={handler.onNext} class="btn btn-circle shadow animate-fade-out-right opacity-0  !animate-duration-300  group-hover:opacity-100 group-hover:animate-fade-in-right">❯</a>
                        </div>
                    )
                case 'always':
                    return (
                        <div class="absolute !m-0 flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a onClick={handler.onPrev} class="btn  btn-circle shadow animate-fade-in-left">❮</a>
                            <a onClick={handler.onNext} class="btn  btn-circle shadow animate-fade-in-right">❯</a>
                        </div>
                    )
                case 'never':
                default:
                    return <></>
            }
        })

        return () => render.value
    },
})