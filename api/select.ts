import { SelectList } from "~/types/entity";

/**
 * 获取平台列表
 */
export const platformSelect = async () => request<SelectList[]>("/platform/select", { method: "GET", isToken: true });