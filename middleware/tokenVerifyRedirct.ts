import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(({ path }) => {
    const { token } = useUserStore();
    const { $localePath } = useNuxtApp()
    const loginPath = $localePath({ name: 'auth-login' });
    if (!token && loginPath !== path) {
        return navigateTo(loginPath);
    }
})