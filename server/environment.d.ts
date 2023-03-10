declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            MONGOURL: string
        }
    }
}

export {}