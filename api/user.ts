import { UpdateUserPassWrodDto, UserDto } from "~/types/dto";
import { UserData } from "~/types/entity";

/**
 * 查询用户信息
 */
export const getUserInfo = async () => request<UserData>("/user", { method: "GET", isToken: true });


// 更新用户信息
export const setUserInfo = async (data: UserDto) => request("/user", { method: "PUT", body:data, isToken: true });

// 更新用户密码
export const setUserPassword = async (data: UpdateUserPassWrodDto) => request("/user/password", { method: "PUT", body:data, isToken: true });
