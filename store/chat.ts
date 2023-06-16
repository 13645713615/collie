import { defineStore } from "pinia";
import { getRoomList } from "~/api/room";
import { Messages, RoomData } from "~/types/entity";
import { SUBSCRIBEMESSAGE, useSocketStore } from "./socket";
import { RespResusl } from "~/utils/request";
import { groupBy } from "lodash";
import { useObserved } from "@lemonpeel2/hooks"
import { useNotification } from "~/composables/useNotification";


export const useChatStore = defineStore("chat", () => {

    const { emit, socket } = useSocketStore()
    /**
     * 房间列表
     */
    const roomList = reactive<RoomData[]>([]);
    /**
     * 当前选中的房间id
     */
    const activeRoomId = ref<number | undefined>(undefined);

    /**
     * 当前选中的房间
     */
    const currentRoom = computed<RoomData | undefined>(() => roomList.find((item) => item.id == activeRoomId.value))
    /**
     * 未读消息
     */
    const unreadMessage = reactive<Map<number, Messages>>(new Map());
    /**
     * 未读消息根据房间id分组
     */
    const unreadMessageGroupByRoomId = computed<Record<string, Messages[]>>(() => groupBy(Array.from(unreadMessage.values()), "room_id"));
    /**
     * 未读消息数量
     */
    const unreadMessageCounts = computed(() => utils.getUnreadMessageCounts())

    const notification = useNotification()

    const observed = useObserved<Messages["room_id"] | "unread">()

    if (process.client) {
        socket().on(SUBSCRIBEMESSAGE.MESSAGS, (res: RespResusl<Messages[] | Messages>) => {
            if (res.data) utils.pushMessage(Array.isArray(res.data) ? res.data : [res.data])
        })
    }

    observed.on("unread", (messages: Messages[]) => utils.notificationMessage(messages))

    const { data: platformSelect } = useSelectData("platformSelect")

    const utils = {
        queryIndex(id: number) {
            const index = roomList.findIndex((item) => item.id == id)
            return index === -1 ? null : index
        },
        getUnreadMessageCounts() {
            const counts: Record<number | "all", number> = { all: 0 }
            unreadMessage.forEach(({ status, room_id }) => {
                if (status === "unread") {
                    counts[room_id] ? counts[room_id]++ : counts[room_id] = 1;
                    counts.all++;
                }
            })
            return counts;
        },
        pushMessage(messages: Messages[]) {
            const currentRoomNews: Array<Messages> = []
            const unreadMessageNews: Array<Messages> = []
            messages.forEach((value) => {
                if (activeRoomId.value != null && value.room_id == activeRoomId.value) {
                    currentRoomNews.push(value)
                    unreadMessage.delete(value.id);
                } else if (value.status === "unread") {
                    unreadMessage.set(value.id, value)
                    unreadMessageNews.push(value)
                }
            })
            if (currentRoomNews.length) observed.emit(activeRoomId.value!, currentRoomNews);
            if (unreadMessageNews.length) observed.emit("unread", unreadMessageNews);
        },
        // 未读消息通知
        notificationMessage(messages: Messages[]) {
            const image = platformSelect.value?.get(messages[0].room_id)?.image;

            if (messages.length > 1) {
                notification("收到新消息", { image, body: `您有 ${messages.length} 条未读消息`, path: "/chat" })
            } else {
                const { room_id, content } = messages[0];
                const { name } = roomList.find((item) => item.id == room_id) ?? {};
                if (name) {
                    notification(name, { image, body: content, path: `/chat/${room_id}` })
                }
            }
        }
    }

    const actions = {
        /**
         * 获取新消息
         */
        onCurrentMessage(obs: (data: Messages[]) => void) {
            if (activeRoomId.value) {
                observed.on<Messages[]>(activeRoomId.value, obs)
            }
        },
        /**
        * 置顶
        * @param id 房间id
        */
        moveUpRoom(id?: number) {
            if (id == undefined || roomList[0]?.id == id) return;
            const index = utils.queryIndex(id)
            if (index) {
                const temp = roomList[index]
                roomList.splice(index, 1)
                roomList.unshift(temp)
            }
        },
        /**
        * 矫正当前选中的id
        * @param beforeIndex 消息下标
        */
        querySuitableActiveRoomId(beforeIndex?: number | null) {
            if (beforeIndex != null && roomList.length) {
                const nextId = roomList[beforeIndex]?.id
                const prevId = roomList[beforeIndex - 1]?.id
                return nextId ?? prevId
            }
        },
        /**
        * 修改当前选中的id
        * @param name 房间id
        */
        changeActiveRoomId(id?: number) {
            activeRoomId.value = id
        },
        /**
        * 创建房间
        * @param name 房间名称
        */
        async createRoom(name: string) {
            const room = await emit<RoomData>(SUBSCRIBEMESSAGE.CREATE_ROOM, { name, platform_id: 0 });
            roomList.unshift(room);
            return room;
        },
        /**
        * 删除房间
        * @param roomId 房间id
        */
        async deleteRoom(roomId: number) {
            await emit<RoomData>(SUBSCRIBEMESSAGE.DELETE_ROOM, roomId);
            const index = utils.queryIndex(roomId);
            if (index != null) roomList.splice(index, 1);
            return index;
        },
        /**
        * 获取房间列表
        */
        async getRoomList() {
            if (!roomList.length) {
                const { data } = await getRoomList()
                roomList.push(...data)
            }
            return toRaw(roomList);
        },
        /**
         * 发送消息
         * @param room_id 房间id
         * @param platform_id 平台id
         * @param content 消息内容
         */
        async sendMessage(room_id: number, platform_id: number, content: string) {
            const message = await emit<Messages>(SUBSCRIBEMESSAGE.SEND, { room_id, platform_id, content })
            return message
        },
        /**
         * 重发
        * @param room_id 房间id
        * @param platform_id 平台id
        * @param id 消息id
        */
        async resendMessage(room_id: number, platform_id: number, id: number) {
            await emit<Messages>(SUBSCRIBEMESSAGE.REACQUIRE_MESSAGS, { room_id, platform_id, id })
        },
        /**
         * 标记已读
         * @param room_id 房间id
        */
        readMessage(room_id: number) {
            const roomUnreadMessage = unreadMessageGroupByRoomId.value[room_id];

            if (length) {
                for (const iterator of structuredClone(toRaw(roomUnreadMessage))) {
                    unreadMessage.delete(iterator.id)
                }
            }
        }
    }

    return {
        roomList,
        activeRoomId,
        currentRoom,
        unreadMessageCounts,
        unreadMessageGroupByRoomId,
        platformSelect,
        ...actions,
    }
})