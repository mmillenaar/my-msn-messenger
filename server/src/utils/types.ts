import { MessageStatus } from "./constants";

export interface UserTypes {
    _id: string;
    email: string;
    password: string;
    username: string;
}

export interface ChatMessageTypes {
    text: string;
    senderId: string;
    recipientId: string;
    timestamp: number;
    status: MessageStatus;
}