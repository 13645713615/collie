import { useChatStore } from "~/store/chat"
import Menu from "./Menu"
import MenuItem from "./MenuItem"
import Swap from "./Swap"
import ThemeButton from "./ThemeButton"
import { useUserStore } from "~/store/user"

export default defineComponent({
    name: 'Navigation',
    setup() {

        const route = useRoute()

        const user = toRef(useUserStore(), "user")

        const { public: { apiBase } } = useRuntimeConfig()

        const avatar = computed(() => user.value && `${apiBase}${user.value.avatar}`)

        const unreadMessageCount = toRef(useChatStore(), "unreadMessageCounts")

        return {
            user,
            avatar,
            defaultMenuName: route.path.split("/").at(1),
            unreadMessageCount
        }
    },
    render() {
        return (
            <nav class="w-60 lg:w-20 animate-duration-500">
                <div class="bg-base-100 h-full lg:rounded-xl py-4  flex flex-col box-border">
                    <div class="lg:mb-15 flex gap-x-4 lg:justify-center lg:px-0  px-4 items-center">
                        <div class="avatar">
                            <div class="w-12 mask mask-squircle">
                                <img src={this.avatar}  alt="Avatar"/>
                            </div>
                        </div>
                        <div class="space-y-2 lg:hidden">
                            <p>Carroll</p>
                            <small class="text-small block">{this.user?.email}</small>
                        </div>
                    </div>
                    <i class="lg:hidden bg-base-300 h-[1px] my-4 bg-base-content bg-opacity-10"></i>
                    <Menu modelValue={this.defaultMenuName} class="box-border  px-3 rounded-box gap-y-4 flex-auto">
                        <MenuItem to="/chat" name="chat" class="group lg:justify-center lg:m-auto">
                            <MenuItemContex  title={this.$t("components.navigation.menu.chat")}  indicator={this.unreadMessageCount.all} icon="i-mdi-message-outline" onIcon="i-mdi-message"></MenuItemContex>
                        </MenuItem>
                        <MenuItem to="/setup" name="setup" class="group lg:justify-center lg:m-auto">
                            <MenuItemContex animation="rotate" title={this.$t("components.navigation.menu.setup")} icon="i-mdi-cog-outline" onIcon="i-mdi-cog"></MenuItemContex>
                        </MenuItem>
                        <li class="flex-auto invisible"></li>
                        <MenuItem class="group lg:justify-center lg:m-auto">
                            <ThemeButton class=" group-hover:color-primary opacity-80"></ThemeButton>
                            <span class="group-hover:color-primary lg:hidden group-active:color-current">{this.$t("components.navigation.menu.theme")}</span>
                        </MenuItem>
                        <MenuItem to="/auth" name="auth" replace class="group lg:justify-center lg:m-auto">
                            <MenuItemContex animation="rotate" title={this.$t("components.navigation.menu.signOut")} icon="i-mdi-power" ></MenuItemContex>
                        </MenuItem>
                    </Menu>
                </div>
            </nav>
        )
    }
})



const MenuItemContex = defineComponent({
    name: 'MenuItemContex',
    props: {
        active: Boolean,
        icon: String,
        onIcon: String,
        title: String,
        indicator: Number,
        animation: {
            type: String as PropType<"rotate" | "flip">,
            default: "flip"
        }
    },
    inheritAttrs: true,
    setup(props) {

        const defaultSlots = () => (<i class={`${props.icon} w-6 h-6 block group-hover:color-primary group-active:color-current   opacity-80`}></i>)

        const onSlots = () => (<i class={`${props.onIcon} w-6 h-6 block  opacity-80`}></i>)

        return () => {

            const context = [
                (<Swap modelValue={props.active} animation={props.animation} disabled v-slots={{ default: defaultSlots, on: onSlots }} />),
                (<span class="lg:hidden group-active:color-current group-hover:color-primary ">{props.title}</span>)
            ]

            if (props.indicator) {
                return (
                    <div class="indicator w-full">
                        <span class="indicator-item  badge badge-secondary font-mono text-[0.75rem] lg:translate-x-1/2 lg:translate-y--1/2 translate-x-0 translate-y-[3px]">{props.indicator > 99 ? '99+' : props.indicator}</span>
                        <div class="flex items-center gap-3">
                            {context}
                        </div>
                    </div>
                )
            } else {
                return (<> {context} </>)
            }
        }
    }
})