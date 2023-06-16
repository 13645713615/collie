import { Button, Logo } from "#components"
import { storeToRefs } from "pinia"
import { TransitionGroup } from "vue"
import { ButtonNode } from "~/composables/useDefineButton"
import { useAppStore } from "~/store/app"
import Swap from "./Swap"

export default defineComponent({
    name: 'Header',
    emits: {
        trigger: () => true
    },
    setup(_, { emit }) {

        const { state } = useButtonState()

        const { go } = useRouter();

        const appStore = useAppStore()

        const { hasHistory, prevHistory } = storeToRefs(appStore)

        const handler = {
            onTrigger: () => {
                emit('trigger')
            },
            onNavigation() {
                if (hasHistory.value) {
                    if (prevHistory.value) go(prevHistory.value[1]);
                } else {
                    handler.onTrigger()
                }
            }
        }

        return {
            buttons: computed(() => state.value.filter(n => n) as ButtonNode[]),
            hasHistory,
            ...handler
        }
    },
    render() {
        return (
            <header class="navbar lg:py-0 lg:items-start sticky shadow lg:shadow-none top-0 z-40   bg-primary text-primary-content lg:bg-transparent lg:text-current box-border">
                <div class="flex-none lg:hidden">
                    <Button wrap square ghost onClick={this.onNavigation}>
                        <Swap modelValue={this.hasHistory} disabled>
                            {{
                                default: () => <i class="i-mdi-menu w-6 h-6 block"></i>,
                                on: () => <i class="i-mdi-arrow-left w-6 h-6 block"></i>
                            }}
                        </Swap>
                    </Button>
                </div>
                <div class="flex-1">
                    <div class="btn btn-ghost normal-case text-xl"><Logo class="!w-8 !h-8 mr-3 !hidden md:!inline-flex" />Collie</div>
                </div>
                <div class="flex-none lg:space-x-sm relative">
                    <div class="flex gap-x-xl">
                        <TransitionGroup name="fade" type="animation">
                            {this.buttons.map(({ context, key, ...props }) => <div key={key}>{h(Button, props, context)}</div>)}
                        </TransitionGroup>
                    </div>
                </div>
            </header>
        )
    }
})