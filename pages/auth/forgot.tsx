import { Button, NuxtLink, SendButton } from "#components"
import { useService, useValidation } from "@lemonpeel2/hooks"
import { isEmpty } from "lodash"
import { forget } from "~/api/auth"
import { mailCaptcha } from "~/api/mail"
import { ForgetDto } from "~/types/dto"

export default defineComponent({
    name: 'Forgot',
    setup() {

        const { t } = useI18n()

        definePageMeta({
            title: "pages.auth.forgot.title",
            description: "pages.auth.forgot.description",
            pageTransition: {
                leaveActiveClass: 'animate-bounce-out-left absolute',
                enterActiveClass: 'animate-bounce-in-left',
            },
        })

        const { replace } = useRouter()
        const localePath = useLocalePath()
        const { error: fail, success, info } = useMessage();

        const i18n = {
            email: t("pages.auth.forgot.label.email"),
            password: t("pages.auth.forgot.label.password"),
            code: t("pages.auth.forgot.label.code"),
        }

        const form = reactive<ForgetDto>({ email: '', password: '', code: '' });

        const { validate, validateField, isInvalid, isValid, getResult } = useValidation<ForgetDto>(form, {
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
            code: {
                required: true,
                message: t("validate.required", { field: i18n.code })
            },
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

        const { run, loading } = useService(forget, {
            onSuccess: (data) => {
                success(data.message, { time: 2000, onClose: () => replace(localePath({ name: 'auth-login' })) });
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
            },
            async onSend(next: (status?: boolean) => void) {
                const valid = await validateField("email");
                if (isEmpty(valid)) {
                    try {
                        await mailCaptcha({ email: form.email, type: "reset" });
                        info(t("pages.auth.forgot.message.send", { email: form.email }));
                        next();
                    } catch (error: any) {
                        fail(error?.message, { time: 4000 });
                        next(false);
                    }
                } else {
                    next(false);
                }
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
            isInvalidClass: (name: keyof ForgetDto) => ({ 'input-error animate-head-shake': isInvalid(name), 'input-success': isValid(name) }),
            ...handler
        }
    },
    render() {
        return (
            <section class="card justify-center flex-row  w-full h-full lg:w-sm lg:min-w-sm xl:w-lg xl:min-w-lg  rounded-0 lg:rounded-xl lg:shadow-xl bg-base-100">
                <div class="card-body max-w-sm">
                    <h2 class="text-2xl font-bold mt-5">{this.$t("pages.auth.forgot.text.welcome")}</h2>
                    <p class="flex-grow-0 opacity-60 mt-1 mb-10">{this.$t("pages.auth.forgot.text.hint")}</p>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.forgot.label.email")}</span>
                            </label>
                            <input type="email" name="email" onBlur={() => this.validateField("email")} v-model={this.form.email} autocomplete="email" placeholder="email" class={splicing(['input input-bordered', this.isInvalidClass("email")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("email")}</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.forgot.label.code")}</span>
                            </label>
                            <div class="input-group">
                                <input type="text" name="code" onBlur={() => this.validateField("code")} v-model={this.form.code} autocomplete="one-time-code" placeholder="code" class={splicing(['input input-bordered flex-auto', this.isInvalidClass("code")])} />
                                <SendButton onSend={this.onSend} class="w-26" />
                            </div>
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("code")}</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text capitalize">{this.$t("pages.auth.forgot.label.password")}</span>
                            </label>
                            <input type="password" name="password" onBlur={() => this.validateField("password")} v-model={this.form.password} autocomplete="new-password" placeholder="password" class={splicing(['input input-bordered', this.isInvalidClass("password")])} />
                            <label class="label">
                                <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("password")}</span>
                            </label>
                        </div>
                        <div class="form-control mt-2">
                            <Button loading={this.loading} htmlType="submit" type="primary">{this.$t("pages.auth.forgot.button.reset")}</Button>
                        </div>
                    </form>
                    <i class="flex-auto"></i>
                    <div class="text-center">
                        {this.$t("pages.auth.forgot.text.login")}
                        <NuxtLink to={this.localePath({ name: "auth-login" })} class="link link-hover vertical-text-top  ml-1">{this.$t("pages.auth.forgot.link.login")}</NuxtLink>
                    </div>
                </div>
            </section>
        )
    }
})