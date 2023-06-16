export interface UserData {
    userId: string
    username: string
    password: string
    email: string
    role: string
    avatar: string
    status: number
    created_at: number
    updated_at: number
    last_login: number
    password_update_time: number
}

export interface RoomData {
    id: number
    name: string
    user_id: string;
    platform_id: number
    create_user_id: string;
    created_at: number
    updated_at: number
    is_delete?: boolean
    delete_at?: number
}

export interface PlatformData {
    id: number;
    name: string;
    avatar: string;
    options?: Record<string, any>;
    created_at: string;
    updated_at: string;
    is_delete: boolean;
    delete_at: string;
}


export interface Messages {
    content: string;
    role: 'system' | 'user' | 'assistant';
    time: number;
    id: number;
    room_id: number;
    status: "unread" | "read" | "sending" | "failed"
}


export interface Pages {
    page?: number;
    size?: number;
}


export interface SelectList {
    value: number
    lable: string
    image?: string
}