import { Modal } from "#components";
import { useService, useValidation } from "@lemonpeel2/hooks";
import { isEmpty } from "lodash";
import { setUserPassword } from "~/api/user";
import Button from "~/components/Button";
import { modalProps } from "~/components/Modal";
import { useUserStore } from "~/store/user"
import { UpdateUserPassWrodDto } from "~/types/dto";

export default defineComponent({
    name: "Lock",
    setup() {

        const visible = ref<boolean>(false)

        const user = toRef(useUserStore(), "user")

        const updateTiem = computed(() => user.value && day(user.value.password_update_time ?? user.value.created_at).toNow())

        const methods = {
            createRoomComplete() {
                if (user.value) user.value.password_update_time = Date.now()
            }
        }

        const handler = {
            onUpdate() {
                visible.value = true
            }
        }

        return {
            handler,
            methods,
            visible,
            updateTiem,
            user
        }
    },
    render() {
        return (
            <div class="card  bg-base-100 lg:rounded-xl rounded-0 max-w-2xl w-full mx-auto overflow-hidden">
                <UpdatePwdMoadl onComplete={this.methods.createRoomComplete} v-model={this.visible} />
                <div class="card-body">
                    <h2 class="card-title text-lg">{this.$t("pages.index.setup.lock.text.title")}</h2>
                    <div class="flex-grow-1">
                        <span class="text-small">{this.$t("pages.index.setup.lock.text.hint")}</span>
                        <div class="flex flex-wrap items-stretch mt-5 gap-x-6 gap-y-2 pt-3">
                            <div class="flex-1 min-w-xs tracking-wider text-lg leading-none">••••••••</div>
                            <div class="flex-1 text-small whitespace-nowrap">{this.$t("pages.index.setup.lock.text.updateTiem",{ time: this.updateTiem})}</div>
                        </div>
                        <div class="mt-5">
                            <Button onClick={this.handler.onUpdate} outline size="sm">{this.$t("pages.index.setup.lock.button.update")}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})



// 修改密码
const UpdatePwdMoadl = defineComponent({
    name: 'UpdatePwdMoadl',
    emits: {
        complete: () => true
    },
    props: modalProps,
    setup(_, { emit }) {
        const { t } = useI18n()

        const form = reactive<UpdateUserPassWrodDto>({ oldPassword: "", newPassword: "" })

        const modal = ref<any>()

        const { validate, validateField, isInvalid, isValid, getResult, clearValidate } = useValidation(form, {
            oldPassword: [
                {
                    required: true,
                    message: t("validate.required", { field: t("pages.index.setup.lock.label.oldPassword") })
                }
            ],
            newPassword: [
                {
                    required: true,
                    message: t("validate.required", { field: t("pages.index.setup.lock.label.newPassword") })
                }
            ]
        })


        const prompt = useAsyncPrompt()

        const { runAsync, loading } = useService(setUserPassword, {
            onSuccess: () => {
                modal.value?.handle.onClose();
                emit("complete")
            }
        })

        const handler = {
            async onSubmit() {
                const valid = await validate();
                if (isEmpty(valid)) prompt(runAsync(form))
            },
            onClear() {
                form.oldPassword = "";
                form.newPassword = "";
                clearValidate()
            }
        }

        return {
            modal,
            loading,
            form,
            handler,
            validateField,
            isInvalid,
            isValid,
            getResult,
            isInvalidClass: (name: keyof typeof form) => ({ 'input-error animate-head-shake': isInvalid(name), 'input-success': isValid(name) }),
        }
    },
    render() {
        return (
            <Modal {...this.$props} {...this.$attrs} onClear={this.handler.onClear} ref={"modal"} mobile>
                {{
                    default: () => (
                        <>
                            <h3 class="font-bold text-lg">{this.$t("pages.index.setup.lock.text.update")}</h3>
                            <form class=" mt-5 max-w-lg">
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text capitalize">{this.$t("pages.index.setup.lock.label.oldPassword")}</span>
                                    </label>
                                    <input type="text" name="email" autocomplete="email" hidden></input>
                                    <input type="password" name="password" onBlur={() => this.validateField("oldPassword")} v-model={this.form.oldPassword} placeholder="oldPassword" autocomplete="current-password" class={splicing(['input input-bordered', this.isInvalidClass("oldPassword")])} />
                                    <label class="label">
                                        <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("oldPassword")}</span>
                                    </label>
                                </div>
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text capitalize">{this.$t("pages.index.setup.lock.label.newPassword")}</span>
                                    </label>
                                    <input type="password" name="new-password" onBlur={() => this.validateField("newPassword")} v-model={this.form.newPassword} placeholder="newPassword" autocomplete="new-password" class={splicing(['input input-bordered', this.isInvalidClass("newPassword")])} />
                                    <label class="label">
                                        <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("newPassword")}</span>
                                    </label>
                                </div>
                            </form>
                        </>
                    ),
                    action: () => (
                        <Button loading={this.loading} onClick={this.handler.onSubmit}>{this.$t("pages.index.setup.lock.button.submit")}</Button>
                    )
                }}
            </Modal>
        )
    }
})