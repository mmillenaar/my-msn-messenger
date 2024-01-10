import { MessageStatus } from "./constants";

export interface ChatMessageTypes {
    text: string;
    senderId: string;
    recipientId: string;
    timestamp: number;
    id: string;
    status: MessageStatus
}

interface ChatTypes {
    id: string;
    participants: string[];
    messages: ChatMessageTypes[];
}

export interface UserTypes {
    id: string;
    username: string;
    email: string;
    chats:ChatTypes[];
}

export interface AuthDataTypes {
    isAuthenticated: boolean
    user: UserTypes
}