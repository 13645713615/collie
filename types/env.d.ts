export interface MetaEnv {
    VITE_PACK_MODE: 'dev' | 'production'
    VITE_BASEURL: string
    VITE_TOKEN_KEY: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends MetaEnv { }
    }
}