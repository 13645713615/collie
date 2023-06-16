import { RequireFormat } from "~/types/utils";
import MessageContainer from "./MessageContainer";
import Message from "./Message";
import { createGlobalState } from "@lemonpeel2/hooks";

interface MessageServiceOption {
    message?: string,                                                                               // 消息文本
    time?: number | null,                                                                           // 显示的时间
    status?: "info" | "success" | "warning" | "error",                                                                          // 消息状态
    position?: "right" | "left" | "center" ,                                                       // 消息位置
    render?: () => VNode,                                                                         // 自定义内容渲染函数
    onClick?: (e: MouseEvent) => void,                                                              // 自定义点击处理动作
    onClose?: () => void,                                                                           // 处理消息关闭之后的动作
}

type MessageServiceFormatOption = RequireFormat<MessageServiceOption, 'time' | 'status'> & {
    id: string,
    close: () => void,
}

const messageServiceState = createGlobalState(() => {
    const state = reactive<MessageServiceFormatOption[]>([])
    return state
})

export { MessageContainer, MessageServiceOption, MessageServiceFormatOption, messageServiceState }
export default Message
