import { Info } from "#components";

export default defineComponent({
    name: "SetupInfo",
    setup() {

        definePageMeta({
            title: "pages.index.setup.info.title",
            description: "pages.index.setup.info.description",
        })

        return () => <Info />
    }
})