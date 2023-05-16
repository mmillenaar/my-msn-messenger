import { User } from "./src/utils/types";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            MONGOURL: string
        }
    }
    namespace Express {
        interface Request {
            user?: User;
            isAuthenticated?: () => boolean;
        }
    }
}

export {}