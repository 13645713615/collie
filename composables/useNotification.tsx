import { useAppStore } from "~/store/app"

interface NotificationOptions {
    body: string,
    path: string,
    image?: string
}

export const useNotification = () => {

    const { notify, browser } = toRefs(useAppStore())

    const message = useMessage()

    const localePath = useLocalePath()

    const { push } = useRouter();

    const send = (title: string, options: NotificationOptions) => {

        const visibility = isVisibility()

        if (visibility && notify.value) {
            const service = message({
                position: "right",
                time: 5000,
                render: Notification(title, options.body, () => {
                    push(localePath(options.path))
                    service.close()
                })
            })
        } else if (browser.value) {
            sendNotification(title, { body: options.body, icon: "/favicon.ico", image: options.image }, () => {
                window.focus()
                push(localePath(options.path))
            })
        }
    }

    return send
}

const isVisibility = () => !document.hidden

const Notification = (title: string, body: string, click?: (e: Event) => void) => () => (
    <div class="max-w-xs md:w-md flex items-center w-full cursor-pointer" onClick={click}>
        <div class="flex-1 flex items-center gap-4 overflow-hidden">
            <i class=" w-6 h-6 i-mdi-information-outline block"></i>
            <div class="flex-1 overflow-hidden">
                <h3 class="font-bold leading-7">{title}</h3>
                <div class="text-xs truncate">{body} </div>
            </div>
        </div>
        <div class="flex-none hidden md:block">
            <button class="btn btn-sm">See</button>
        </div>
    </div>
)