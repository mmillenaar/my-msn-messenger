import { Socket, io } from 'socket.io-client'
import { ChatMessageForServer, ChatType, NotificationType, UserType } from './types';

let socket: Socket | null = null;

export const initializeSocketConnection = (userId: string) => {
    socket = io(process.env.REACT_APP_BACKEND_URL!)
    console.log('Socket connection established')

    socket.emit('register-user', userId)
}

export const changeUserStatus = (userId: string, newStatus: string) => {
    if (!socket) return

    socket.emit('user-status-change', { userId, newStatus })
}

export const openChat = (chatId: string) => {
    if (!socket) return

    socket.emit('get-chat-history', chatId)
}

export const sendMessage = (message: ChatMessageForServer, chatId?: string) => {
    if (!socket) return

    socket.emit('new-message',{ message, chatId })
}

export const notifyTyping = (isTyping: boolean, userId: string) => {
    if (!socket) return

    socket.emit('user-typing', { isTyping, userId })
}

export const setupChatListener = (
    setChatData: (newChatData: ChatType) => void,
) => {
    if (!socket) return

    socket.on('chat-render', async (chatData) => {
        try {
            setChatData(chatData);
        }
        catch (err) {
            console.error(err);
        }
    })

    return () => {
        if (socket) {
            socket.off('chat-render')
        }
    }
}

export const setupTypingListener = (setIsContactTyping: (setIsContactTyping: boolean) => void) => {
    if (!socket) return

    socket.on('typing', (isTyping: boolean) => {
        setIsContactTyping(isTyping)
    })

    return () => {
        if (socket) {
            socket.off('typing')
        }
    }
}

export const setupUserEventsListener = (setUserData: (updatedUser: UserType) => void) => {
    if (!socket) return

    socket.on('new-user-status', (user: UserType) => {
        setUserData(user)
    })
    socket.on('new-user-connected', ({contactUsername, updatedUser}: {contactUsername: string, updatedUser: UserType}) => {
        setUserData(updatedUser)
    })
    socket.on('incoming-contact-request', (updatedReceiver: UserType) => {
        setUserData(updatedReceiver)
    })
    socket.on('accepted-contact-request', (updatedSender: UserType) => {
        setUserData(updatedSender)
    })
}

export const setupNotificationListener = (callback: (notification: NotificationType) => void) => {
    if (!socket) return

    socket.on('incoming-message', (notification: NotificationType) => {
        callback(notification)
    })
    socket.on('new-user-connected', ({contactUsername, updatedUser}: {contactUsername: string, updatedUser: UserType}) => {
        callback({ user: { username: contactUsername } })
    })
}

export const closeSocketConnection = (userId: string | undefined) => {
    if (!socket) return console.error('Socket connection not established')

    else if (!userId) return console.error('User id not provided')

    else {
        socket.emit('logout', userId)
        socket.disconnect()
        console.log('Socket connection closed')
        socket = null
    }
}

export default socket