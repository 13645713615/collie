import Background from "~/components/Background"
import Screen from "~/components/Screen"
import { MessageContainer, NuxtLayout, NuxtLoadingIndicator, NuxtPage } from "#components"
import { useAppStore } from "./store/app"

export default defineComponent({
    name: 'App',
    setup() {

        const { theme, size } = toRefs(useAppStore())

        const route = useRoute()

        const style = computed(() => `font-size:${size.value}px`)

        const { t } = useI18n()

        const head = useLocaleHead({
            addDirAttribute: true,
            identifierAttribute: 'id',
            addSeoAttributes: true
        })

        useHead(computed(() => ({
            title: route.meta.title ? `${t("title")} - ${t(route.meta.title as string)}` : t("title"),
            htmlAttrs: {
                'data-theme': theme,
                style,
                lang: head.value.htmlAttrs?.lang,
                dir: head.value.htmlAttrs?.dir
            },
            link: head.value.link,
            meta: [
                ...head.value.meta ?? [],
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover" },
                { name: "description", content: t(route.meta.description ? route.meta.description as string : "description")  }
            ]
        })))

        return {
            size
        }
    },
    render() {
        return (
            <NuxtLayout>
                <NuxtLoadingIndicator />
                <MessageContainer />
                <div class="w-screen font-serif">
                    <Background />
                    <div class="relative z-1 min-h-screen flex flex-col items-center justify-center">
                        <div class="overflow-y-auto">
                            <Screen>
                                <NuxtPage />
                            </Screen>
                        </div>
                    </div>
                    <footer class="footer footer-center absolute bottom-0 p-4 text-base-300 hidden box-border lg:grid">
                        <div>
                            <p>Copyright © 2023 - All right reserved by ACME Industries Ltd</p>
                        </div>
                    </footer>
                </div>
            </NuxtLayout>
        )
    }
})
