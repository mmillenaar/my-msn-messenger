import { MessageStatus } from "./constants";

export interface ChatMessageType {
    text: string;
    senderId: string;
    recipientId: string;
    timestamp: number;
    id: string;
    status: MessageStatus
}

interface ChatType {
    id: string;
    participants: string[];
    messages: ChatMessageType[];
}

export interface UserType {
    id: string;
    username: string;
    email: string;
    chats: ChatType[];
    contacts: string[];
    contactRequests: {
        sent: ContactRequestType[];
        received: ContactRequestType[];
    }
}

export interface ContactRequestType {
    username: string;
    email: string;
    id: string
}

export interface AuthDataType {
    isAuthenticated: boolean
    user: UserType
}

export interface ContactRequestModalActionType {
    accept: boolean;
    reject: boolean;
}