import type { ForgetDto, LoginDto, RegisterDto } from "~/types/dto"
import type { UserData } from "~/types/entity";


/**
 * 登录
 * @param  {LoginDto} data
 */
export const login = async (data: LoginDto) => request<UserData>("/auth/login", { body: data, method: "POST" });

/**
 * 注册
 * @param  {RegisterDto} data
 */
export const register = async (data: RegisterDto) => request("/auth/register", { body: data, method: "POST" });


/**
 * 忘记密码
 * @param  {ForgetDto} data
 */
export const forget = async (data: ForgetDto) => request("/auth/forget", { body: data, method: "PUT" });