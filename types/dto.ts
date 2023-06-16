
export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    username: string
    password: string
    email: string
}

export interface ForgetDto {
    email: string
    password: string
    code: string
}

export interface MailCaptchaDto {
    email: string
    type: "register" | "reset"
}


export interface UserDto {
    username?: string;
    email?: string;
    avatar?: string;
}


export interface UpdateUserPassWrodDto {
    oldPassword: string;
    newPassword: string;
}