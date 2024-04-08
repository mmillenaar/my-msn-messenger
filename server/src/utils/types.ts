import { MessageStatus, UserStatus } from "./constants";

export interface UserType {
    _id: string;
    username: string;
    email: string;
    password: string;
    status: UserStatus;
    chats: [ChatType];
    contacts: ContactType[];
    contactRequests: {
        sent: string[],
        received: string[]
    }
}

export interface ChatType {
    participantsIds: string[],
    messages: ChatMessageType[],
    _id: string;
}

export interface ChatMessageType {
    text: string;
    senderId: string;
    recipientId: string;
    timestamp: number;
    status: MessageStatus;
}

export interface ContactType {
    _id: string;
    chatId?: string;
}