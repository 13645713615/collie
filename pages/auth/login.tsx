import { Button, NuxtLink } from "#components"
import { useValidation, useService } from "@lemonpeel2/hooks"
import { login } from "~/api/auth"
import { LoginDto } from "~/types/dto"
import { isEmpty } from "lodash";
import { useUserStore } from "~/store/user";

export default defineComponent({
    name: 'Login',
    setup() {
        const { t } = useI18n()

        definePageMeta({
            title: 'pages.auth.login.title',
            description:'pages.auth.login.description',
            pageTransition: {
                leaveActiveClass: 'animate-bounce-out-right absolute',
                enterActiveClass: 'animate-bounce-in-right'
            }
        })


        const { replace } = useRouter()
        const localePath = useLocalePath()
        const { setToken, setUser } = useUserStore()
        const { error: fail, success } = useMessage();

        const i18n = {
            email: t("pages.auth.login.label.email"),
            password: t("pages.auth.login.label.password"),
        }

        const form = reactive<LoginDto>({ email: '', password: '' });

        const { validate, validateField, isInvalid, isValid, getResult } = useValidation<LoginDto>(form, {
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

        const { run, loading } = useService(login, {
            onSuccess: (data) => {
                setToken(data?.ext);
                setUser(data?.data);
                success(data.message, { time: 2000, onClose: () => replace(localePath({ name: 'index-chat' })) })
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
            isInvalidClass: (name: keyof LoginDto) => ({ 'input-error animate-head-shake': isInvalid(name), 'input-success': isValid(name) }),
            ...handler
        }
    },
    render() {
        return (
            <section class="card justify-center w-full h-full lg:w-sm lg:min-w-sm xl:w-lg xl:min-w-lg   flex-row rounded-0 lg:rounded-xl lg:shadow-xl bg-base-100">
                <div class="card-body max-w-sm">
                    <h2 class="text-2xl font-bold mt-5">{this.$t("pages.auth.login.text.welcome")}</h2>
                    <p class="flex-grow-0 opacity-60 mt-1 mb-10">{this.$t("pages.auth.login.text.hint")}</p>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.login.label.email")}</span>
                            </label>
                            <input type="email" name="email" onBlur={() => this.validateField("email")} v-model={this.form.email} placeholder="email" autocomplete="email" class={splicing(['input input-bordered', this.isInvalidClass("email")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("email")}</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.login.label.password")}</span>
                                <NuxtLink to={this.localePath({ name: "auth-forgot" })} {...{ tabindex: "-1" }} class="label-text-alt text-primary link link-hover">{this.$t("pages.auth.login.link.forgot")}</NuxtLink>
                            </label>
                            <input type="password" name="password" onBlur={() => this.validateField("password")} v-model={this.form.password} placeholder="password" autocomplete="current-password" class={splicing(['input input-bordered', this.isInvalidClass("password")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("password")}</span>
                            </label>
                        </div>
                        <div class="form-control mt-2">
                            <Button loading={this.loading} htmlType="submit" type="primary">{this.$t("pages.auth.login.button.login")}</Button>
                            <div class="divider">OR</div>
                            <Button outline class="gap-2">
                                <img class="w-6 h-6" src="/google.svg" alt="Google" />
                                {this.$t("pages.auth.login.button.google")}
                            </Button>
                        </div>
                    </form>
                    <i class="flex-auto"></i>
                    <div class="text-center">
                        {this.$t("pages.auth.login.text.register")}
                        <NuxtLink to={this.localePath({ name: "auth-register" })} class="link link-hover vertical-text-top ml-1">{this.$t("pages.auth.login.link.register")}</NuxtLink>
                    </div>
                </div>
            </section>
        )
    }
})