import Swap from "./Swap"
import { useAppStore } from "~/store/app";

export default defineComponent({
    name: 'ThemeButton',
    setup() {

        const appStore = useAppStore();

        const browserTheme = toRef(appStore, "browserTheme")

        const handler = {
            onChange: (value?: boolean) => {
                const theme = value ? "dark" : "light"
                appStore.$patch((state) => {
                    state.theme = theme
                    state.browserTheme = theme
                    state.themeAuto = true
                })
            }
        }

        return () => (
            <Swap modelValue={browserTheme.value == "dark"} onUpdate:modelValue={handler.onChange} animation="rotate">
                {{
                    default: () => <i class="i-mdi-brightness-4 w-6 h-6 block"></i>,
                    on: () => <i class="i-mdi-brightness-7 w-6 h-6 block"></i>,
                }}
            </Swap>
        )
    }
})