import { useAppStore } from "~/store/app"

export default defineComponent({
    name: "Notification",
    setup() {
        const appStore = useAppStore()

        const { notify, browser } = toRefs(appStore)

        const { warning } = useMessage()

        const handler = {
            onNotifyChange: (e: Event) => {
                const el = e.target as HTMLInputElement;
                appStore.setNotify(el.checked);
            },
            onBrowserNotifyChange: async (e: Event) => {
                const el = e.target as HTMLInputElement;
                try {
                    await appStore.setBrowserNotify(el.checked);
                } catch (error: any) {
                    error && warning(error.message)
                } finally {
                    el.checked = browser.value
                }
            }
        }

        return {
            notify,
            browser,
            handler
        }

    },
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto overflow-hidden">
                <div class="card-body">
                    <h2 class="card-title">{this.$t("pages.index.setup.notification.text.title")}</h2>
                    <span class="text-small">{this.$t("pages.index.setup.notification.text.hint")}</span>
                    <form class="mt-5 flex-grow-1">
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">{this.$t("pages.index.setup.notification.label.notify")}</span>
                                <input type="checkbox" class="toggle toggle-info" onChange={this.handler.onNotifyChange} checked={this.notify} />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">{this.$t("pages.index.setup.notification.label.browser")}</span>
                                <input type="checkbox" class="toggle toggle-info" onChange={this.handler.onBrowserNotifyChange} checked={this.browser} />
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
})