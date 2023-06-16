import { Breakpoint, Menu, MenuItem, Scroll, Info, Language, Lock, Theme, Notification, About } from "#components"
import { useAppStore } from "~/store/app"

export default defineComponent({
    name: 'setup',
    setup() {

        definePageMeta({
            title: "pages.index.setup.title",
            description: "pages.index.setup.description"
        })

        const scroll = ref<any>()

        const menuActive = ref<string>('info')

        const { push } = useRouter()

        const localePath = useLocalePath()

        const isMobile = useIsMobileSize()

        const size = toRef(useAppStore(), "size");

        const handler = {
            onMenuChange(value?: string | number) {
                if (!value) return;

                if (isMobile.value) {
                    push(localePath({ name: `index-setup-${value}` }));
                } else {
                    scroll.value?.methods.scrollToElement(`.${value}`)
                }
            }
        }
        onMounted(() => {
            if (!isMobile.value) {
                watch([isMobile, size], ([mobile]) => {
                    if (!mobile) delay(300).then(() => scroll.value?.methods.refresh())
                })
            }
        })

        return {
            scroll,
            menuActive,
            handler
        }
    },
    render() {
        return (
            <div class="flex gap-x-4">
                <div class="md:flex-none md:max-w-1/3 md:min-w-2/10 md:w-60 flex-1 md:bg-base-100 space-y-3 md:space-y-0 md:rounded-xl overflow-hidden">
                    <Menu v-model={this.menuActive} onChange={this.handler.onMenuChange} class=" bg-base-100 p-2  flex-nowrap">
                        <MenuItem name='info'>
                            <i class="w-5 h-5 block i-mdi-badge-account-horizontal-outline"></i>
                            {this.$t("pages.index.setup.menu.info")}
                        </MenuItem>
                        <MenuItem name='lock'>
                            <i class="w-5 h-5 block i-mdi-lock-outline"></i>
                            {this.$t("pages.index.setup.menu.lock")}
                        </MenuItem>
                    </Menu>
                    <i class="mx-2 h-[1px] bg-base-content !bg-opacity-10 hidden md:block"></i>
                    <Menu v-model={this.menuActive} onChange={this.handler.onMenuChange} class="bg-base-100 p-2 flex-nowrap">
                        <MenuItem name='notification'>
                            <i class="w-5 h-5 block i-mdi-bell-cog-outline"></i>
                            {this.$t("pages.index.setup.menu.notification")}
                        </MenuItem>
                        <MenuItem name='theme'>
                            <i class="w-5 h-5 block i-mdi-palette-outline"></i>
                            {this.$t("pages.index.setup.menu.theme")}
                        </MenuItem>
                        <MenuItem name='language'>
                            <i class="w-5 h-5 block i-mdi-web"></i>
                            {this.$t("pages.index.setup.menu.language")}
                        </MenuItem>
                    </Menu>
                    <i class="mx-2 h-[1px] bg-base-content !bg-opacity-10 hidden md:block"></i>
                    <Menu v-model={this.menuActive} onChange={this.handler.onMenuChange} class="bg-base-100 p-2 flex-nowrap">
                        <MenuItem name='about'>
                            <i class="w-5 h-5 block i-mdi-information-slab-circle-outline"></i>
                            {this.$t("pages.index.setup.menu.about")}
                        </MenuItem>
                    </Menu>
                </div>
                <Breakpoint>
                    {{
                        lg: () => (
                            <Scroll ref="scroll" class="w-full h-full" contentClassName="scroll-slide flex flex-col  gap-y-4" preventDefault={true}>
                                <Info class="info" />
                                <Lock class="lock" />
                                <Notification class="notification" />
                                <Theme class="theme" />
                                <Language class="language" />
                                <About class="about" />
                            </Scroll>
                        ),
                    }}
                </Breakpoint>
            </div>
        )
    }
})