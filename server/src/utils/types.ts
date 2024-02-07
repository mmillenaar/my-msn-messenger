import { MessageStatus } from "./constants";

export interface UserType {
    _id: string;
    username: string;
    email: string;
    password: string;
    chats: [ChatType];
    contacts: string[];
    contactRequests: {
        sent: string[],
        received: string[]
    }
}

export interface ChatType {
    participantIds: string[],
    messages: ChatMessageType[],
}

export interface ChatMessageType {
    text: string;
    senderId: string;
    recipientId: string;
    timestamp: number;
    status: MessageStatus;
}