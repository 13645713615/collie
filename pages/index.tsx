import { NuxtPage, Drawer, Header, Navigation } from "#components"
import { useUserStore } from "~/store/user"
import { useSocketStore } from "~/store/socket";
import { useAppStore } from "~/store/app";

export default defineComponent({
    name: 'Index',
    async setup() {

        definePageMeta({
            keepalive: true,
            redirect: (to) => pathJoin(to.path, "chat"),
            middleware: ["token-verify-redirct"],
        })

        const { connect, disconnect } = useSocketStore();

        const localePath = useLocalePath();

        const { getUser } = useUserStore();

        const { addHistory, resetHistory } = useAppStore();

        const { replace } = useRouter();

        const { path, name } = useRoute();

        const sidebar = toRef(useAppStore(), "sidebar")

        const isOpen = ref(false);

        const handler = {
            onTrigger: () => {
                isOpen.value = !isOpen.value;
            }
        }

        onMounted(() => {
            connect()
            addHistory(path, name as string)
        })

        onUnmounted(() => {
            disconnect()
            resetHistory()
        })

        onBeforeRouteUpdate((to) => {
            isOpen.value = false;
            addHistory(to.path, to.name as string)
        })

        const { error } = await useAsyncData("userInfo", getUser);

        if (error.value) {
            await replace(localePath({ name: 'auth-login' }))
        }

        return () => (
            <Drawer end={sidebar.value == 'right'} v-model={isOpen.value} class="h-full lg:gap-x-4 lg:px-4 box-border" maxHeight="initial" mobile>
                {{
                    default: () => (
                        <div class="h-full relative overflow-y-auto">
                            <Header onTrigger={handler.onTrigger} />
                            <NuxtPage class="max-h-[calc(100%-4rem)] h-full" />
                        </div>
                    ),
                    side: () => (<Navigation class={sidebar.value == 'right' ? 'lg:animate-fade-in-right' : 'lg:animate-fade-in-left'} />)
                }}
            </Drawer>
        )
    }
})