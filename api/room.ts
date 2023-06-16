import { RoomData } from "~/types/entity";

/**
 * 查询房间列表
 */
export const getRoomList = async () => request<RoomData[]>("/room", { method: "GET", isToken: true });


/**
 * 查询房间详情
 */
export const getRoomDetail = async (id: number) => request<RoomData>(`/room/:id`, { params: { id }, method: "GET", isToken: true });