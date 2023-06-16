import path from "path"

export default defineNuxtConfig({
    devServer: {
        port: 4000,
    },
    runtimeConfig: {
        public: {
            apiBase: '',
            socketUrl: ''
        },
    },
    modules: [
        "@unocss/nuxt",
        '@nuxtjs/i18n',
        '@pinia/nuxt'
    ],
    i18n: {
        locales: [
            {
                code: 'zh',
                name: '中文（简体）',
                file: "zh.json",
                iso: 'zh-CN'
            },
            {
                code: 'zh-TW',
                name: '中文（繁体）',
                file: "zh-TW.json",
                iso: 'zh-TW'
            },
            {
                code: 'en',
                name: 'English',
                file: "en.json",
                iso: 'en-US'
            },
            {
                code: 'ru',
                name: 'русский',
                file: "ru.json",
                iso: 'ru-RU'
            },
        ],
        strategy: 'prefix_except_default',
        defaultLocale: "en",
        lazy: true,
        langDir: "locales/",
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',  // recommended
        }
    },
    css: [
        "@/assets/css/reset.css",
        "@/assets/css/daisy.css",
        "@/assets/css/transition.css",
        "@/assets/css/loading.css"
    ],
    hooks: {
        'pages:extend'(routes) {
            const Index = routes.find(route => route.name === 'index')
            Index?.children?.push({
                name: "index-chat-context",
                path: "/chat/context/:id",
                file: path.resolve(__dirname, "pages/index/chat/[id].tsx")
            })
        }
    }
})
