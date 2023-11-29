import { ReactNode } from "react";

export interface AppContextProviderProps {
    children: ReactNode
}

export interface ContextTypes {
    checkUserLogin: () => Promise<boolean | null>;
    isUserLoggedIn: boolean | null;
    logout: () => void;
}

export interface AuthDataTypes {
    isAuthenticated: boolean
}

export interface ChatMessage {
    username: string,
    message: string,
    date: string,
}