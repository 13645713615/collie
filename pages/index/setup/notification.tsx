import { Notification } from "#components";

export default defineComponent({
    name: "SetupNotification",
    setup() {

        definePageMeta({
            title: "pages.index.setup.notification.title",
            description: "pages.index.setup.notification.description",
        })

        return ()=> <Notification />
    }

})