import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "~/store/user";
import { RespResusl } from "~/utils/request";


interface SocketStatus {
    // 链接中
    connecting: boolean,
    // 链接成功
    connected: boolean,
    // 链接失败
    connectError: Error | null,
}

export enum SUBSCRIBEMESSAGE {
    SEND = 'send',
    CREATE_ROOM = 'create_room',
    DELETE_ROOM = 'delete_room',
    MESSAGS = 'message',
    REACQUIRE_MESSAGS = 'reacquire_message',
}

export const useSocketStore = defineStore("socket", () => {

    const token = toRef(useUserStore(), "token")

    const socketStatus = reactive<SocketStatus>({
        connecting: false,
        connected: false,
        connectError: null,
    })

    let socket: Socket;

    if (process.client) {
        socket = io(useRuntimeConfig().public.socketUrl, {
            autoConnect: false,
            transports: ["websocket"],
            timeout: 10000,
            reconnection: true,
            auth: {
                token: token.value,
            }
        })

        socket.io.on("error", (error) => {
            socketStatus.connectError = error;
        })

        socket.on("disconnect", () => {
            socketStatus.connected = false;
            socketStatus.connecting = false;
        })

        socket.on("connect", () => {
            socketStatus.connected = socket.connected
            if (socketStatus.connected) {
                socketStatus.connecting = false;
            }
        })

        socket.io.on("reconnect", () => {
            socketStatus.connecting = false;
            socketStatus.connectError = null;
        })

        socket.io.on("reconnect_attempt", (attempt) => {
            socketStatus.connecting = true;
            socketStatus.connectError = null;
        })

    }
    const actions = {
        /**
         * 连接
         */
        connect() {
            if (!socketStatus.connected && !socketStatus.connecting) {
                socketStatus.connecting = true;
                socket.connect()
            }
        },
        /**
        * 断开连接
        */
        disconnect() {
            if (socketStatus.connected) {
                socketStatus.connecting = false;
                socket.disconnect()
            }
        },
        /**
        * 获取io
        */
        io() {
            return socket.io
        },
        /**
        * 获取socket
        */
        socket() {
            return socket
        },
        /**
        * 监听事件
        */
        async on<T>(ev: SUBSCRIBEMESSAGE) {
            const { reject, resolve, result } = contract<T>()
            socket.on(ev, (res: RespResusl<T>) => {
                if (res.status === 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            })
            return result
        },
        /**
        * 发送事件
        */
        async emit<T>(ev: SUBSCRIBEMESSAGE, data: any) {
            const { reject, resolve, result } = contract<T>()
            socket.emit(ev, data);
            socket.once(ev, (res: RespResusl<T>) => {
                if (res.status === 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            });
            return result
        }
    }


    return { ...actions, socketStatus }

})