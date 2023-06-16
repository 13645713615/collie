import { Transition } from "vue"

export default defineComponent({
    name: 'Spin',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        return () => (
            <Transition leaveActiveClass="animate-fade-out">
                <div v-show={props.loading} class="loading-spin"></div>
            </Transition>

        )
    }
})