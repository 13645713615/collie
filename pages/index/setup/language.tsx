import { Language } from "#components"

export default defineComponent({
    name: "SetupLanguage",
    setup() {

        definePageMeta({
            title: "pages.index.setup.language.title",
            description: "pages.index.setup.language.description",
        })

        return () => <Language />
    }
})