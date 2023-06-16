import { About } from "#components"

export default defineComponent({
    name: 'SetupAbout',
    setup() {

        definePageMeta({
            title: "pages.index.setup.about.title",
            description: "pages.index.setup.about.description",
        })

        return () => <About />
    }
})