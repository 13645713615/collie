import { Button, NuxtLink } from "#components"
import { useService, useValidation } from "@lemonpeel2/hooks"
import { isEmpty } from "lodash"
import { register } from "~/api/auth"
import { RegisterDto } from "~/types/dto"

export default defineComponent({
    name: 'Register',
    setup() {
        const { t } = useI18n()

        definePageMeta({
            title:"pages.auth.register.title",
            description:'pages.auth.register.description',
            pageTransition: {
                leaveActiveClass: 'animate-bounce-out-left absolute',
                enterActiveClass: 'animate-bounce-in-left',
            },
        })

        const { replace } = useRouter()
        const localePath = useLocalePath()
        const { error: fail, success } = useMessage();

        const i18n = {
            email: t("pages.auth.register.label.email"),
            password: t("pages.auth.register.label.password"),
            username: t("pages.auth.register.label.username"),
        }

        const form = reactive<RegisterDto>({ email: '', password: '', username: '' });

        const { validate, validateField, isInvalid, isValid, getResult } = useValidation<RegisterDto>(form, {
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
            password: [
                {
                    required: true,
                    message: t("validate.required", { field: i18n.password })
                },
                {
                    min: 6,
                    max: 16,
                    message: t("validate.length", { field: i18n.password, min: 6, max: 16 })
                }
            ]
        })

        const { run, loading } = useService(register, {
            onSuccess: (data) => {
                success(data.message, { time: 2000, onClose: () => replace(localePath({ name: 'auth-login' })) })
            },
            onError: (error) => {
                fail(error.message, { time: 4000 });
            }
        })

        const handler = {
            async onSubmit(e: Event) {
                e.preventDefault();
                const valid = await validate();
                if (isEmpty(valid)) run(form);
            }
        }

        return {
            form,
            loading,
            localePath,
            validateField,
            isInvalid,
            getResult,
            isValid,
            isInvalidClass: (name: keyof RegisterDto) => ({ 'input-error animate-head-shake': isInvalid(name), 'input-success': isValid(name) }),
            ...handler
        }
    },
    render() {
        return (
            <section class="card justify-center flex-row  w-full h-full lg:w-sm lg:min-w-sm xl:w-lg xl:min-w-lg  rounded-0 lg:rounded-xl lg:shadow-xl bg-base-100">
                <div class="card-body max-w-sm">
                    <h2 class="text-2xl font-bold mt-5">{this.$t("pages.auth.register.text.welcome")}</h2>
                    <p class="flex-grow-0 opacity-60 mt-1 mb-10">{this.$t("pages.auth.register.text.hint")}</p>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.register.label.username")}</span>
                            </label>
                            <input type="text" name="username" onBlur={() => this.validateField("username")} v-model={this.form.username} autocomplete="username" placeholder="name" class={splicing(['input input-bordered', this.isInvalidClass("username")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("username")}</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.register.label.email")}</span>
                            </label>
                            <input type="email" name="email" onBlur={() => this.validateField("email")} v-model={this.form.email} autocomplete="email" placeholder="email" class={splicing(['input input-bordered', this.isInvalidClass("email")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("email")}</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.register.label.password")}</span>
                            </label>
                            <input type="password" name="password" onBlur={() => this.validateField("password")} v-model={this.form.password} autocomplete="new-password" placeholder="password" class={splicing(['input input-bordered', this.isInvalidClass("password")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("password")}</span>
                            </label>
                        </div>
                        <div class="form-control mt-2">
                            <Button loading={this.loading} htmlType="submit" type="primary">{this.$t("pages.auth.register.button.register")}</Button>
                        </div>
                    </form>
                    <i class="flex-auto"></i>
                    <div class="text-center">
                        {this.$t("pages.auth.register.text.login")}
                        <NuxtLink to={this.localePath({ name: "auth-login" })} class="link link-hover vertical-text-top  ml-1">{this.$t("pages.auth.register.link.login")}</NuxtLink>
                    </div>
                </div>
            </section>
        )
    }
})