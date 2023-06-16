import { Messages, Pages } from "~/types/entity";

/**
 * 获取房间消息
 */
export const getRoomMessages = async (id: string | number, pages?: Pages) => request<Messages[]>("/message/:id", { params: { id }, query: pages, method: "GET", isToken: true });

/**
 * 已读
 */
export const readRoomMessages = async (id: string | number, ids: Array<number>) => request<Messages[]>("/message/read/:id", { params: { id }, body: { ids }, method: "POST", isToken: true });