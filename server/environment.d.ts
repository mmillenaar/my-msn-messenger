declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string
            MONGOURL: string
            CLIENT_ORIGIN: string
            JWT_SECRET: string
            NODE_ENV: string
        }
    }
}

export {}