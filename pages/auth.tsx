import { Breakpoint, Hero, NuxtPage } from "#components"
import { useAppStore } from "~/store/app"
import { useUserStore } from "~/store/user"
export default defineComponent({
    name: 'Auth',
    setup() {

        definePageMeta({
            redirect: (to) => to.path + "/login"
        })

        const { setToken } = useUserStore()

        setToken()

        return () => (
            <div class="flex justify-end h-full lg:px-4 gap-x-4 relative overflow-hidden">
                <Breakpoint v-slots={{ lg: () => <Hero class="flex-auto" /> }} />
                <NuxtPage />
            </div>
        )
    }
})