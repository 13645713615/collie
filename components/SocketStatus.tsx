import { useSocketStore } from "~/store/socket"
import Loading from "./Loading"
import { ClientOnly } from "#components"

export default defineComponent({
    name: 'SocketStatus',
    setup() {
        const { socketStatus } = useSocketStore()

        return () => (
            <ClientOnly>
                {
                    socketStatus.connecting && (
                        <div class="h-10 flex items-center justify-center gap-x-2 bg-info">
                            <Loading loading></Loading>
                            <span class="ml-2 text-sm">连接中...</span>
                        </div>
                    )
                }
            </ClientOnly>
        )
    }
})