import { debounce, isEmpty } from "lodash";
import { defineStore } from "pinia";
import { getUserInfo, setUserInfo } from "~/api/user";
import { UserData } from "~/types/entity";

export const useUserStore = defineStore("user", () => {

    const token = useCookie<string | undefined>(STORAGE_KEYS.TOKEN)

    const user = ref<UserData | undefined>();

    const actions = {
        setToken(value?: string | undefined) {
            token.value = value;
        },
        async setUser(value: UserData | undefined) {
            user.value = value;
        },
        async saveUser() {
            if (user.value) {
                const { username, avatar, email } = user.value;
                await setUserInfo({ username, avatar, email });
            }
        },
        async getUser() {
            if (isEmpty(user.value)) {
                const { data } = await getUserInfo();
                actions.setUser(data);
            }
            return user.value
        }
    }

    if (process.client) {
        watch(user, equal<UserData>(["avatar", "email", "username"], debounce(actions.saveUser, 1000)), { deep: true })
    }

    return { user, token, ...actions }
})