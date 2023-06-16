import { defineConfig, presetUno, presetIcons } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
    presets: [
        presetIcons(),
        presetUno(),
        presetDaisy({
            styled: true,
            utils: true,
            base: true,
            themes: [
                'light',
                'dark',
                'synthwave',
                'halloween',
                'fantasy',
                'lemonade',
            ],
        })
    ],
    theme: {

    },
    shortcuts: {
        'scale-hover': 'transition-transform duration-300 ease-in-out transform hover:scale-120',
        'scale-group-hover': 'transition-transform duration-300 ease-in-out transform group-hover:scale-120',
        'text-small': 'text-xs font-bold opacity-60',
        'center': 'top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2',
    },
    preflights: [
        {
            getCSS: () => `*, :before, :after{
                box-sizing: border-box;
                border-style: solid;
                border-width: 0px;
            }`
        }
    ]
})