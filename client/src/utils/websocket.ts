import { Socket, io } from 'socket.io-client'
import { ChatMessageType, UserType } from './types';

let socket: Socket | null = null;

export const initializeSocketConnection = (userId: string) => {
    socket = io('http://localhost:3030')
    console.log('Socket connection established')

    socket.emit('register-user', userId)
}

export const openChat = (senderId: string, recipientId: string) => {
    if (!socket) return

    socket.emit('get-chat-history', { senderId, recipientId })
}

export const sendMessage = (message: ChatMessageType) => {
    if (!socket) return

    socket.emit('new-message', message)
}

export const setupChatListener = (callback: (data: ChatMessageType[]) => void) => {
    if (!socket) return

    socket.on('chat-render', async (chatData) => {
        try {
            callback(chatData);
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

export const setupContactRequestListener = (callback: (updatedUser: UserType) => void) => {
    if (!socket) return

    socket.on('incoming-contact-request', (updatedReceiver: UserType) => {
        callback(updatedReceiver)
    })
    socket.on('accepted-contact-request', (updatedSender: UserType) => {
        callback(updatedSender)
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