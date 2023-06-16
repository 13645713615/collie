import { TransitionGroup } from "vue"
import Message from "./Message"
import { MessageServiceFormatOption, messageServiceState } from "."


export default defineComponent({
    name: 'MessageContainer',
    props: {
        duration: { type: String, default: "1.875rem" },
    },
    emits: {
        close: () => true
    },
    setup(props) {

        const styles = { padding: props.duration }

        const state = messageServiceState()

        // const { refList, onRefList } = useRefList<InstanceType<typeof Message> extends { $props: infer Data } ? Data & ComponentPublicInstance : ComponentPublicInstance>()

        const methods = {
            closeMessage: (i: number) => {
                state.splice(i, 1)
            },
            setMessage: async (option: MessageServiceFormatOption) => {
                state.push(option)
                await nextTick()
            }
        }

        return { state, methods, styles }
    },
    render() {
        return (
            <div class="pointer-events-none fixed top-0 left-0 z-100">
                <div class="h-screen w-screen flex flex-col box-border gap-y-3 overflow-hidden relative" style={this.styles}>
                    <TransitionGroup name="message">
                        {this.state.map((option, index) => <Message key={option.id} option={option} onClose={() => this.methods.closeMessage(index)} />)}
                    </TransitionGroup>
                </div>
            </div>
        )
    }
})