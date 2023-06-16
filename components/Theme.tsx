import { Sidebar, Theme, useAppStore } from "~/store/app";

export default defineComponent({
    name: "Theme",
    setup() {
        const appStore = useAppStore();

        const { theme, themes, sidebar, size, themeAuto } = toRefs(appStore)

        const dropdownToggle = ref<boolean>(false)

        const handler = {
            onThemeChange: (value: Theme) => {
                appStore.setTheme(value)
                dropdownToggle.value = false
            },
            onSidebarChange: (e: Event) => {
                const el = e.target as HTMLInputElement;
                appStore.setSidebar(el.value as Sidebar)
            },
            onSizeChange: (e: Event) => {
                const el = e.target as HTMLInputElement;
                appStore.setSize(Number(el.value))
            },
            onThemeAutoChange: (e: Event) => {
                const el = e.target as HTMLInputElement;
                appStore.setThemeAuto(el.checked)
            },
            onDropdownToggle: (e: Event) => {
                const el = e.target as HTMLDetailsElement;
                dropdownToggle.value = el.open
            }
        }

        return {
            dropdownToggle,
            themes,
            theme,
            sidebar,
            size,
            themeAuto,
            handler
        }

    },
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto ">
                <div class="card-body">
                    <h2 class="card-title">{this.$t("pages.index.setup.theme.text.title")}</h2>
                    <form class="mt-5 flex-grow-1">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.index.setup.theme.label.theme")}</span>
                            </label>
                            <div class="flex gap-x-6 flex-wrap">
                                <details open={this.dropdownToggle} {...{ onToggle: this.handler.onDropdownToggle }} class="dropdown flex-1 min-w-60">
                                    <summary data-theme={this.theme} class="btn btn-ghost w-full relative hover:!bg-transparent active:!bg-transparent justify-start p-0">
                                        <ThemeColor showIcon={false} value={this.theme} class="flex-1 h-full pr-12 rounded-lg" />
                                        <div class="w-12 absolute right-0">
                                            <i class="block i-mdi-chevron-down w-6 h-6 text-base-content m-auto"></i>
                                        </div>
                                    </summary>
                                    <div class="dropdown-content !visible !opacity-100 !scale-100  mt-2 bg-base-200 text-base-content rounded-box  max-h-96 w-full overflow-y-auto shadow">
                                        <div class="grid grid-cols-1 gap-3 p-3">
                                            {
                                                this.themes.map((theme) => (
                                                    <button type="button" key={theme} onClick={this.handler.onThemeChange.bind(null, theme)} class="outline-base-content p-0 overflow-hidden rounded-lg text-left">
                                                        <ThemeColor value={theme} checked={this.theme === theme} />
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </details>
                                <div class="form-control">
                                    <label class="label cursor-pointer">
                                        <span class="label-text capitalize mr-2 whitespace-nowrap">{this.$t("pages.index.setup.theme.text.themeAuto")}</span>
                                        <input type="checkbox" class="toggle toggle-info" onChange={this.handler.onThemeAutoChange} checked={this.themeAuto} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="divider before:h-px after:h-px"></div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.index.setup.theme.label.fontSize")}</span>
                            </label>
                            <div class="flex items-center">
                                <label class="flex-1">
                                    <input type="range" min="12" max="18" step="1" onInput={this.handler.onSizeChange} value={this.size} class="range range-info prevent" />
                                    <div class="w-full flex justify-between text-xs px-2">
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                        <span>|</span>
                                    </div>
                                </label>
                                <span class="px-4">{this.size}</span>
                            </div>
                        </div>
                        <div class="divider before:h-px after:h-px"></div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">{this.$t("pages.index.setup.theme.label.sidebar")}</span>
                            </label>
                            <div class="pl-10">
                                <div class="form-control" >
                                    <label class="label cursor-pointer">
                                        <span class="label-text">{this.$t("pages.index.setup.theme.text.sidebarLeft")}</span>
                                        <input checked={this.sidebar === 'left'} type="radio" value='left' onChange={this.handler.onSidebarChange} name="sidebar" class="radio checked:bg-info" />
                                    </label>
                                </div>
                                <div class="form-control" >
                                    <label class="label cursor-pointer">
                                        <span class="label-text">{this.$t("pages.index.setup.theme.text.sidebarRight")}</span>
                                        <input checked={this.sidebar === 'right'} type="radio" value='right' onChange={this.handler.onSidebarChange} name="sidebar" class="radio checked:bg-info" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
})


const ThemeColor = defineComponent({
    name: "ThemeColor",
    props: {
        checked: {
            type: Boolean,
        },
        value: {
            type: String,
            required: true
        },
        showIcon: {
            type: Boolean,
            default: true
        }
    },
    render() {
        return (
            <div data-theme={this.value} class="bg-base-100 text-base-content  w-full cursor-pointer">
                <div class="grid grid-cols-5 grid-rows-3 h-full">
                    <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                        <i v-show={this.showIcon} class={`block h-4 w-4 i-mdi-check invisible ${this.checked && '!visible'}`}></i>
                        <b class="flex-grow text-sm text-left font-bold capitalize">{this.value}</b>
                        <div class="flex h-full flex-shrink-0 flex-wrap gap-1">
                            <div class="bg-primary w-2 rounded"></div>
                            <div class="bg-secondary w-2 rounded"></div>
                            <div class="bg-accent w-2 rounded"></div>
                            <div class="bg-neutral w-2 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})