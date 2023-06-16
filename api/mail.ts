import { MailCaptchaDto } from "~/types/dto";

/**
 * 发送邮箱验证码
 * @param  {MailCaptchaDto} data
 */
export const mailCaptcha = async (data: MailCaptchaDto) => request("/mail/captcha", { body: data, method: "POST" });
