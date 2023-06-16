import { Theme } from "#components"

export default defineComponent({
    name: "SetupTheme",
    setup() {

        definePageMeta({
            title: "pages.index.setup.theme.title",
            description: "pages.index.setup.theme.description",
        })


        return () => <Theme />
    }
})