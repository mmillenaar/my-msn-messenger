declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            MONGOURL: string
            CLIENT_ORIGIN: string
            SESSION_SECRET: string
            NODE_ENV: string
        }
    }
}

export {}