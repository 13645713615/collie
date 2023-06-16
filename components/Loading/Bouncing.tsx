import { Transition } from "vue"

export default defineComponent({
    name: 'Bouncing',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        return () => (
            <Transition leaveActiveClass="animate-fade-out">
                <div v-show={props.loading} class="inline-flex w-4 h-4 justify-center items-end">
                    <div class="loading-bouncing"></div>
                </div>
            </Transition>
        )
    }
})