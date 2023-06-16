import { defineStore } from "pinia";

export type Sidebar = 'left' | 'right';

export type Theme = 'light' | 'dark' | 'synthwave' | 'halloween' | 'fantasy' | 'lemonade'

export interface Exterior {
    themeAuto: boolean,
    theme: Theme,
    size: number,
    sidebar: Sidebar
}

export interface Notification {
    // 允许通知
    notify: boolean,
    // 允许浏览器通知
    browser: boolean,
}

export interface History {
    path: string,
    name: string,
    tiemstamp: number
}

export const useAppStore = defineStore("app", () => {

    const themes: Theme[] = ['light', 'dark', 'synthwave', 'halloween', 'fantasy', 'lemonade']

    const exterior = useCookie<Exterior>("exterior", {
        default: () => ({
            themeAuto: true,
            theme: "light",
            size: 16,
            sidebar: "left"
        }),
        watch: true
    });

    const notification = useCookie<Notification>("notification", {
        default: () => ({
            notify: true,
            browser: false
        }),
        watch: true
    })

    const history = reactive<History[]>([])

    const handler = {
        onThemeChange(theme?: Theme) {
            if (theme && exterior.value.themeAuto) exterior.value.theme = theme
        }
    }

    const utils = {
        // 获取当前路由的历史的上一个
        getPrevHistory(): [string, number] | undefined {
            const length = history.length;
            if (length <= 1) return;
            let index = -1, histName = history.at(-1)!.name;
            for (let i = length - 2; i >= 0; i--) {
                const { name } = history[i];
                // 过滤掉重复的路由，比如 /user/1、/user/2 回退到/user
                if (histName != name) {
                    return [histName, index];
                }
                index--;
                histName = name;
            }
        }
    }

    const methods = {
        setTheme(theme: Theme) {
            exterior.value.themeAuto = false;
            exterior.value.theme = theme;
        },
        setThemeAuto(auto: boolean) {
            exterior.value.themeAuto = auto;
            if (auto && browserTheme.value) {
                exterior.value.theme = browserTheme.value;
            }
        },
        setSize(size: number) {
            exterior.value.size = size;
        },
        setSidebar(sidebar: Sidebar) {
            exterior.value.sidebar = sidebar;
        },
        setNotify(notify: boolean) {
            notification.value.notify = notify;
        },
        async setBrowserNotify(notify: boolean) {
            if (notify) {
                const authorized = await requestNotificationPermission();
                if (!authorized) {
                    notify = false;
                }
            }
            notification.value.browser = notify;
        },
        addHistory(path: string, name: string) {
            history.push({ path, name, tiemstamp: Date.now() })
        },
        /**
         * 重置历史记录
         */
        resetHistory() {
            history.length = 0;
        },
    }
    /**
     * 浏览器主题
     */
    const { theme: browserTheme } = useTheme(handler.onThemeChange, { immediate: true })
    /**
     * 获取上一个路由
     */
    const prevHistory = computed(utils.getPrevHistory)
    /**
     * 判断是否可以回退到上一个路由
     */
    const hasHistory = computed(() => Boolean(prevHistory.value?.[0] && /^index-(.+-.+)___.+$/.test(prevHistory.value?.[0])))

    return {
        themes,
        history,
        prevHistory,
        hasHistory,
        browserTheme,
        ...toRefs(exterior.value),
        ...toRefs(notification.value),
        ...methods
    }
})