import { SetInput } from "#components";
import { useModel, useService, useValidation } from "@lemonpeel2/hooks";
import { isEmpty } from "lodash";
import { upload } from "~/api/file";
import { useUserStore } from "~/store/user"
import { UserData } from "~/types/entity";

export default defineComponent({
    name: "Info",
    setup() {

        const userStore = useUserStore()

        const { public: { apiBase } } = useRuntimeConfig()

        const user = useModel<Partial<UserData>>(() => userStore.user || {} as UserData)

        const avatar = computed(() => user.value.avatar && `${apiBase}${user.value.avatar}`)

        const { t } = useI18n()

        const { runAsync, loading } = useService(upload)

        const prompt = useAsyncPrompt();

        const i18n = {
            email: t("pages.index.setup.info.label.email"),
            username: t("pages.index.setup.info.label.username"),
        }


        const { validateField, isInvalid, isValid, getResult, state } = useValidation(user, {
            username: {
                required: true,
                message: t("validate.required", { field: i18n.username })
            },
            email: [
                {
                    required: true,
                    message: t("validate.required", { field: i18n.email })
                },
                {
                    type: "email",
                    message: t("validate.invalid", { field: i18n.email })
                }
            ],
        })

        const methods = {
            isInvalidClass: (name: keyof UserData) => ({ 'input-error animate-head-shake': isInvalid(name), 'input-success': isValid(name) }),
        }

        const handler = {
            onChange<T extends keyof UserData>(name: T) {
                return async (next: (bool?: boolean) => void, value?: string | number) => {
                    user.value[name] = value as UserData[T]
                    const valid = await validateField(name);
                    if (isEmpty(valid)) {
                        next()
                        if (userStore.user) userStore.user[name] = value as UserData[T]
                    } else {
                        next(false)
                    }
                }
            },
            async onUpload(e: Event) {
                const target = e.target as HTMLInputElement
                const file = target.files?.[0]
                // 判断小于8MB
                if (file && file.size < 1024 * 1024 * 8) {
                    const { data } = await prompt(runAsync(file))
                    state.errors.avatar = ""
                    if (userStore.user) userStore.user.avatar = data
                } else {
                    state.errors.avatar = t("validate.filesize", { field: t("pages.index.setup.info.label.avatar"), size: 8 })
                }
                target.value = ""
            }
        }

        return {
            user,
            avatar,
            validateField,
            isInvalid,
            getResult,
            isValid,
            methods,
            handler,
            loading
        }
    },
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto overflow-hidden">
                <div class="card-body">
                    <h2 class="card-title text-lg">{this.$t("pages.index.setup.info.text.title")}</h2>
                    <span class="text-small">{this.$t("pages.index.setup.info.text.hint")}</span>
                    <form class="mt-5 flex-grow-1">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.index.setup.info.label.avatar")}</span>
                            </label>
                            <div class="flex gap-x-4">
                                <div class="avatar flex-none">
                                    <div class="w-18 h-18 rounded-xl">
                                        <img src={this.avatar} alt="Avatar" />
                                    </div>
                                </div>
                                <div class="flex-auto flex items-start justify-evenly flex-col">
                                    <label class={`btn btn-outline btn-sm  border-style-solid ${this.loading && 'loading'}`}>
                                        {this.$t("pages.index.setup.info.button.upload")}
                                        <input onChange={this.handler.onUpload} accept="image/jpeg, image/png" type="file" class="hidden" />
                                    </label>
                                    <span class="text-small">{this.$t("pages.index.setup.info.text.upload")}</span>
                                </div>
                            </div>
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("avatar")}</span>
                            </label>
                        </div>
                        <div class="divider before:h-px after:h-px h-px mt-0"></div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.index.setup.info.label.username")}</span>
                            </label>
                            <SetInput v-model={this.user.username} onChange={this.handler.onChange("username")} class={this.methods.isInvalidClass("username")} {...{ type: "text", placeholder: "name", autocomplete: "username" }} ></SetInput>
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("username")}</span>
                            </label>
                        </div>
                        <div class="divider before:h-px after:h-px h-px mt-0"></div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.index.setup.info.label.email")}</span>
                            </label>
                            <SetInput v-model={this.user.email} onChange={this.handler.onChange("email")} class={this.methods.isInvalidClass("email")} {...{ type: "email", placeholder: "email", autocomplete: "email" }} ></SetInput>
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("email")}</span>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
})