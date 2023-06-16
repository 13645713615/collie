import { useEventListener } from "@lemonpeel2/hooks";

export type Theme = "light" | "dark";

const getTheme = (e: MediaQueryListEvent | MediaQueryList): Theme => e.matches ? "light" : "dark";

export const useTheme = (change?: ((value?: Theme) => void) | null, options?: { immediate?: boolean, default?: Theme }) => {

    const theme = useState<Theme | undefined>("theme", () => options?.default);

    let themeMedia: MediaQueryList | undefined;

    onMounted(() => {
        themeMedia = window.matchMedia("(prefers-color-scheme: light)");

        const listener = (e: MediaQueryListEvent | MediaQueryList) => {
            theme.value = getTheme(e);
            change?.(theme.value);
        };

        if (options?.immediate) listener(themeMedia);

        useEventListener("change", listener, { target: themeMedia as any })
    })

    watchEffect(() => {
        if (theme.value) change?.(theme.value);
    });

    return {
        theme,
        updateTheme: () => {
            if (themeMedia) theme.value = getTheme(themeMedia);
        }
    };
};

