export default defineNuxtRouteMiddleware((to) => {
    if (process.client) {
        const { $localePath: localePath } = useNuxtApp()
        if (to.path === localePath({ name: 'index-chat-id', params: to.params })) {
            const isMobile = useIsMobileSize()
            if (isMobile.value) {
                return navigateTo(localePath({ name: 'index-chat-context', params: { id: to.params.id as string } }))
            }
        }
    }
})