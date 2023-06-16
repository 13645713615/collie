import { NuxtPage, Menu, MenuItem, Modal, Button, SocketStatus } from "#components"
import Breakpoint from "~/components/Breakpoint"
import { TransitionGroup } from "vue"
import { useChatStore } from "~/store/chat"
import { storeToRefs } from "pinia"
import { useService, useValidation } from "@lemonpeel2/hooks"
import { isEmpty } from "lodash"
import { modalProps } from "~/components/Modal"

export default defineNuxtComponent({
    name: 'Chat',
    async setup() {

        definePageMeta({
            title: "pages.index.chat.title",
            description: "pages.index.chat.description",
            middleware: ["breakpoint-redirect"],
        })

        // 定义操作按钮
        useDefineButton([
            {
                key: "chat_insert",
                square: true,
                ghost: true,
                context: () => <i class="i-mdi-shape-square-plus w-6 h-6 block"></i>,
                onClick: () => handler.onInsert()
            }
        ])

        const chatStore = useChatStore()

        const { getRoomList, roomList, changeActiveRoomId } = chatStore

        const { activeRoomId, unreadMessageCounts, platformSelect } = storeToRefs(chatStore)

        const { push } = useRouter()

        const localePath = useLocalePath()
        // 控制创建房间的弹窗的状态
        const visible = ref<boolean>(false)
        // 消息列表
        const rooms = computed(() => roomList.map(item => ({ ...item, lastMinute: day(item.updated_at).toNow() })))

        const methods = {
            createRoomComplete(id: number) {
                push(localePath({ name: "index-chat-id", params: { id: id.toString() } }));
            },
            isUnreadMessage: (room_id: number) => {
                return unreadMessageCounts.value[room_id] > 0
            }
        }

        const handler = {
            onInsert() {
                visible.value = true
            }
        }
        onActivated(() => changeActiveRoomId())

        // 消息列表
        await useAsyncData("getRoomList", getRoomList)

        return {
            platformSelect,
            visible,
            activeRoomId,
            rooms,
            handler,
            localePath,
            methods
        }
    },
    render() {
        return (
            <div class="flex gap-x-4" >
                <CreateRoomMoadl onComplete={this.methods.createRoomComplete} v-model={this.visible} />
                <div class="flex-none flex flex-col flex-nowrap w-full md:min-w-2/10 md:max-w-1/3 lg:w-60 lg:rounded-xl lg:overflow-y-auto overflow-x-hidden bg-base-100">
                    <SocketStatus class="flex-none" />
                    <Menu v-model={this.activeRoomId} class="flex-1 relative  p-2 block">
                        <TransitionGroup name="lightSpeed">
                            {
                                this.rooms.map((room) => (
                                    <MenuItem key={room.id} to={this.localePath({ name: 'index-chat-id', params: { id: room.id.toString() } })} name={room.id} itemClassName="w-full bg-inherit rounded-xl" class="w-full box-border">
                                        <>
                                            <div class={splicing(['avatar', { 'online before:!bg-secondary': this.methods.isUnreadMessage(room.id) }])}>
                                                <div class="w-10 mask mask-squircle">
                                                    <img src={this.platformSelect?.get(room.platform_id)?.image} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div class="flex-auto overflow-hidden space-y-1">
                                                <p class="truncate md:text-sm">{room.name}</p>
                                                <small class="inline-block text-small">{room.lastMinute}</small>
                                            </div>
                                        </>
                                    </MenuItem>
                                ))
                            }
                        </TransitionGroup>
                    </Menu>
                </div>
                <Breakpoint>
                    {{
                        lg: () => <NuxtPage />,
                    }}
                </Breakpoint>
            </div>
        )
    }
})


// 创建聊天室
const CreateRoomMoadl = defineComponent({
    name: 'CreateRoomMoadl',
    emits: {
        complete: (_id: number) => true
    },
    props: modalProps,
    setup(_, { emit }) {
        const { t } = useI18n()

        const form = reactive({ name: "" })

        const modal = ref<any>()

        const { validate, validateField, isInvalid, isValid, getResult, clearValidate } = useValidation(form, {
            name: [
                {
                    required: true,
                    message: t("validate.required", { field: t("pages.index.chat.label.name") })
                }
            ]
        })

        const { createRoom } = useChatStore()

        const prompt = useAsyncPrompt()

        const { runAsync, loading } = useService(createRoom, {
            onSuccess: (data) => {
                modal.value?.handle.onClose();
                emit("complete", data.id)
            }
        })

        const handler = {
            async onSubmit() {
                const valid = await validate();
                if (isEmpty(valid)) prompt(runAsync(form.name))
            },
            onClear() {
                form.name = "";
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
                            <h3 class="font-bold text-lg mb-5">{this.$t("pages.index.chat.text.create")}</h3>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text capitalize">{this.$t("pages.index.chat.label.name")}</span>
                                </label>
                                <input type="text" onBlur={() => this.validateField("name")} v-model={this.form.name} placeholder="name" autocomplete="off" class={splicing(['input input-bordered', this.isInvalidClass("name")])} />
                                <label class="label">
                                    <span class="label-text-alt inline-block h-4 text-error"> {this.getResult("name")}</span>
                                </label>
                            </div>
                        </>
                    ),
                    action: () => (
                        <Button loading={this.loading} onClick={this.handler.onSubmit}>{this.$t("pages.index.chat.button.submit")}</Button>
                    )
                }}
            </Modal>
        )
    }
})