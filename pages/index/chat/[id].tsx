import { useDebouncePlugin, useService } from "@lemonpeel2/hooks";
import { getRoomMessages, readRoomMessages } from "~/api/message";
import { Loading, Button, Scroll, ScrollPullDow } from "#components";
import { useChatStore } from "~/store/chat"
import { Messages, Pages, RoomData } from "~/types/entity";
import { storeToRefs } from "pinia";
import { debounce, forEach, isUndefined } from "lodash";
import { useUserStore } from "~/store/user";
import { getRoomDetail } from "~/api/room";

export default defineNuxtComponent({
    name: 'ChatContext',
    inheritAttrs: true,
    async setup() {
        
        // 定义操作按钮
        useDefineButton([
            {
                key: "chat_delete",
                square: true,
                ghost: true,
                context: () => <i class="i-mdi-delete-outline w-6 h-6 block"></i>,
                onClick: () => handler.onDelete()
            }
        ], true)

        const prompt = useAsyncPrompt();

        const route = useRoute()

        const localePath = useLocalePath()

        const { replace } = useRouter()

        const { error: fail } = useMessage()

        const chatStore = useChatStore()

        const { deleteRoom, querySuitableActiveRoomId, moveUpRoom, changeActiveRoomId, sendMessage, resendMessage, onCurrentMessage, readMessage } = chatStore

        const { platformSelect } = storeToRefs(chatStore)

        const { public: { apiBase } } = useRuntimeConfig()
        // 分页
        const pages = reactive<Required<Pages>>({ page: 1, size: 20 });
        // 总条数
        const total = ref<number>(0)
        // 是否能加载更多数据
        const canLoadMore = computed(() => pages.page * pages.size < total.value)
        // 容器
        const scrollRefs = ref<any>(null);
        // 用户信息
        const user = toRef(useUserStore(), "user")
        // 头像
        const avatar = computed(() => user.value?.avatar ? `${apiBase}${user.value.avatar}` : undefined)
        // 房间头像
        const roomAvatar = computed(() => !isUndefined(currentRoom.value?.platform_id) ? platformSelect.value?.get(currentRoom.value!.platform_id)?.image : "")
        // 当前房间的ID
        const activeRoomId = Number(route.params!.id);
        // 页面激活时，切换当前房间
        onActivated(() => changeActiveRoomId(Number(route.params!.id)))
        // 改变房间ID
        changeActiveRoomId(Number(route.params!.id))

        onMounted(() => {
            read()
            readMessage(activeRoomId)
        })

        // 监听新消息
        onCurrentMessage((message) => {
            forEach(message, (value) => messages.value!.set(value.id, value));
            methods.updateContainer()
            read()
        })

        const methods = {
            async send(content: string) {
                if (!currentRoom.value) return;
                const message = await runAsync(activeRoomId, currentRoom.value.platform_id, content)
                messages.value!.set(message.id, message);
                moveUpRoom(activeRoomId)
            },
            // 读取消息
            async readMessages() {
                const failedIds = iteratorMap(messages.value!, ([_, value]) => value.status == "unread" ? value.id : null)

                if (failedIds.length > 0) {
                    await readRoomMessages(activeRoomId, failedIds)
                }
            },
            // 获取更多消息
            async moreMessages(): Promise<Map<number, Messages>> {
                const { data, ext } = await getRoomMessages(activeRoomId, pages);
                const result = new Map<number, Messages>();
                data.concat(Array.from(toRaw(messages.value!).values())).forEach(item => result.set(item.id, item));
                total.value = ext ?? 0
                return result;
            },
            // 更新容器
            updateContainer: debounce((autoScroll: boolean = true) => {
                if (scrollRefs.value) {
                    const { refresh, scrollToBottom, isBottom } = scrollRefs.value.methods
                    const is = isBottom();
                    nextTick(() => {
                        refresh()
                        if (autoScroll && is) {
                            scrollToBottom(300)
                        } else {
                            scrollToBottom()
                        }
                    })
                }
            }, 300, { leading: true, trailing: true })
        }

        const handler = {
            onEnter: (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !loading.value) {
                    const input = e.target as HTMLInputElement
                    methods.send(input.value.replace(/^[\n]+|[\n]+$/g, '')).then(() => {
                        input.value = ''
                        methods.updateContainer(false)
                    })
                }
            },
            async onDelete() {
                const beforeIndex = await prompt(deleteRoom(activeRoomId));
                const suitableId = querySuitableActiveRoomId(beforeIndex);
                if (suitableId != null) {
                    replace({ params: { id: suitableId } });
                } else {
                    replace(localePath({ name: "index-chat" }));
                }
            },
            onResend({ id }: Messages) {
                if (!currentRoom.value) return;
                resendMessage(activeRoomId, currentRoom.value.platform_id, id)
            },
            async onLoadMore(next: () => void) {
                pages.page++;
                fetchMore().then(() => {
                    next()
                })
            },
            onError(e: Error) {
                fail(e.message)
            }
        }
        // 发送消息
        const { loading, runAsync } = useService(sendMessage, { onError: handler.onError })
        // 更新消息已读
        const { run: read } = useService(methods.readMessages, { onError: handler.onError }, [useDebouncePlugin({ wait: 1000 })])
        // 获取消息列表
        const { runAsync: fetchMore, data: messages } = useService(methods.moreMessages, { shallow: false, initialValue: new Map<number, Messages>(), onError: handler.onError })

        const { refresh, data: currentRoom } = useLazyAsyncData("getRoomDetail", () => getRoomDetail(activeRoomId), { immediate: false, transform: (res) => res.data, default: () => ({} as RoomData) })

        if (chatStore.currentRoom) {
            currentRoom.value = chatStore.currentRoom!
        } else {
            await refresh()
        }

        const { pending } = await useLazyAsyncData("getRoomMessages", async () => {
            await fetchMore();
            methods.updateContainer(false);
        })

        useHead({
            title: computed(() => currentRoom.value?.name ? currentRoom.value.name : '')
        })

        return {
            roomAvatar,
            avatar,
            loading,
            pending,
            messages,
            canLoadMore,
            handler,
            scrollRefs,
            currentRoom,
            platformSelect,
            fetchMore,

        }

    },
    render() {
        return (
            <div class="flex flex-col lg:px-1 px-2 w-full h-full overflow-hidden">
                <div class="relative w-full flex-auto overflow-hidden">
                    <div class="absolute z-1 center pointer-events-none">
                        <Loading loading={this.pending} class="before:w-6 before:h-6 before:border-3 before:animate-duration-1000" />
                    </div>
                    <Scroll class="h-full " ref={(refs) => this.scrollRefs = refs} >
                        <ScrollPullDow disabled={!this.canLoadMore} onPullDown={this.handler.onLoadMore}></ScrollPullDow>
                        <div class="bg-base-200 pb-10">
                            {
                                iteratorMap(this.messages!, ([_, message]) => (<MessageItem onResend={this.handler.onResend} avatar={this.avatar} roomAvatar={this.roomAvatar} status={message.status} key={message.id} data={message} />))
                            }
                        </div>
                    </Scroll>
                </div>
                <div class="lg:mb-1 mb-2 relative">
                    <Loading class="absolute bottom-4 right-4" loading={this.loading}></Loading>
                    <textarea onKeyup={this.handler.onEnter} class="textarea w-full mx-auto shadow textarea-primary  block  box-border resize-none" placeholder="Send a message..."></textarea>
                </div>
            </div>
        )
    }
})


const MessageItem = defineComponent({
    name: 'MessageItem',
    props: {
        status: {
            type: String as PropType<Messages["status"]>,
        },
        data: {
            type: Object as PropType<Messages>,
            required: true
        },
        avatar: {
            type: String
        },
        roomAvatar: {
            type: String
        }
    },
    emits: {
        'resend': (_data: Messages) => true
    },
    setup(props, { emit }) {

        const isSelf = computed(() => props.data.role == "user");

        const bubbleClasses = computed(() => splicing([
            'chat-bubble leading-7',
            {
                'chat-bubble-primary': isSelf.value,
                'chat-bubble-error': props.status == "failed",
            }
        ]))

        const handler = {
            onResend() {
                emit('resend', props.data)
            }
        }

        return () => (
            <div class={`chat ${isSelf.value ? 'chat-end' : 'chat-start'} animate-fade-in-up animate-duration-500`}>
                <div class="chat-image avatar select-none">
                    <div class="w-10 rounded-full">
                        <img src={isSelf.value ? props.avatar : props.roomAvatar} alt="Avatar" />
                    </div>
                </div>
                <div class={bubbleClasses.value}>
                    <span class="select-text">{props.data.content}</span>
                    {
                        props.status === "sending" && (<Loading loading type="bouncing"></Loading>)
                    }
                    {
                        props.status == "failed" && (<Button onClick={handler.onResend} ghost size="sm">重新获取<i class="inline-block i-mdi-refresh w-4 h-4"></i></Button>)
                    }
                </div>
            </div>
        )
    }
})