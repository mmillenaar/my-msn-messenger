import { ContactErrorType, UserStatus } from "./constants";

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
    fontStyle?: string;
    isNudgeMessage?: boolean;
}

export interface ContactType {
    _id: string;
    chatId?: string;
    isBlocked?: boolean;
    hasBlockedMe?: boolean;
}

export interface ContactRequestForClientType {
    username: string;
    email: string;
    id: string
}

export interface ContactForClientType {
    username: string;
    email: string;
    id: string;
    chatId: string;
    status: UserStatus;
    isBlocked?: boolean;
    hasBlockedMe?: boolean;
}

export interface UserForClientType {
    id: string;
    username: string;
    email: string;
    status: UserStatus;
    chats: [ChatType];
    contacts: ContactForClientType[];
    contactRequests: {
        sent: string[],
        received: ContactRequestForClientType[]
    }
}

export interface ContactResponseType {
    success: boolean;
    message: string;
    errorType?: ContactErrorType;
    user?: UserForClientType;
}

export interface UserAuthResult {
    user?: UserType;
    error?: string;
    status?: number;
}