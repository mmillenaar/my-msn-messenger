import { ContactErrorType } from "./constants";

export interface ChatMessageType {
    text: string;
    sender: ContactType;
    timestamp: number;
    recipient: ContactType;
    fontStyle?: string;
    isNudgeMessage?: boolean;
}

export interface ChatMessageForServer {
    text: string;
    senderId: string;
    timestamp: number;
    recipientId: string;
    fontStyle?: string;
    isNudgeMessage?: boolean;
}

export interface ChatType {
    id: string;
    participants: ContactType[];
    messages: ChatMessageType[];
}

export interface UserType {
    id: string;
    username: string;
    email: string;
    status: string;
    chats: ChatType[];
    contacts: ContactType[];
    contactRequests: {
        sent: ContactType[];
        received: ContactType[];
    }
}

export interface ContactType {
    username: string;
    email: string;
    id: string;
    status: string;
    chatId?: string;
    isBlocked?: boolean;
    hasBlockedMe?: boolean;
}

export interface AuthDataType {
    isAuthenticated: boolean
    user: UserType
    token: string
}

export interface ContactRequestActionType {
    accept: boolean;
    reject: boolean;
}

export interface TabType {
    id: string;
    label: string;
    path: string;
    icon?: string;
    hasNotification?: boolean;
}

export interface ContactRequestResponseType {
    success: boolean;
    message: string;
    errorType?: ContactErrorType;
    user?: UserType;
}

export interface CheckboxOptionType {
    label: string;
    id: string;
    name: string;
    checked: boolean;
}

export interface NotificationType {
    user: {
        username: string;
        id?: string;
    };
    message?: string;
    nudge?: boolean;
}

export interface FormUserType {
    email: string;
    password: string;
    username?: string;
}