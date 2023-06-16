import { Lock } from "#components";

export default defineComponent({
    name: "SetupLock",
    setup() {

        definePageMeta({
            title: "pages.index.setup.lock.title",
            description: "pages.index.setup.lock.description",
        })

        return () => <Lock />
    },
})