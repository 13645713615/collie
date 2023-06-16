import { MessageServiceFormatOption, MessageServiceOption, messageServiceState } from "~/components/Message";


export type MessageService = MessageServiceFunction & {
    [k in "info" | "success" | "warning" | "error"]: MessageServiceFunction
}

/**
 * 消息服务函数类型
 */
interface MessageServiceFunction {
    (message?: string | MessageServiceOption, option?: MessageServiceOption): MessageServiceFormatOption
}

/**
 * @name 格式化消息配置参数
 * @msg: 
 * @param {*} param1
 * @return {*}
 */
const formatOption = (() => {
    let idCount = 0
    return (option: MessageServiceOption): MessageServiceFormatOption => {

        return Object.assign(option as MessageServiceFormatOption, {
            id: `message_${idCount++}`,
            close: () => null,
            time: option.time === null ? null : (option.time || 3000),
        })
    }
})()


export const useMessage = (): MessageService => {

    const state = messageServiceState();

    const service = (message?: string | MessageServiceOption, option?: MessageServiceOption) => {
        if (typeof message === "undefined") return;
        let o = typeof message === "object" ? message : { message }
        if (!!option) {
            Object.assign(o, option)
        }
        const fo = formatOption(o)
        state.unshift(fo);
        return fo
    }

    return Object.assign(service, ['success', 'warning', 'error', 'info',].reduce((prev: any, status: any) => {
        prev[status] = function (message: string | MessageServiceOption, option?: MessageServiceOption) {
            const o = typeof message === "object" ? message : { message }
            if (!!option) {
                Object.assign(o, option)
            }
            o.status = status
            return service(o)
        }
        return prev
    }, {}));
}