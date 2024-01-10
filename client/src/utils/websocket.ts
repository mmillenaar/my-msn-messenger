import { Socket, io } from 'socket.io-client'
import { ChatMessageTypes } from './types';

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

export const sendMessage = (message: ChatMessageTypes) => {
    if (!socket) return

    socket.emit('new-message', message)
}

export const setupChatListener = (callback: (data: ChatMessageTypes[]) => void) => {
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

export const closeSocketConnection = (userId: string) => {
    if (socket) {
        socket.emit('logout', userId)
        socket.disconnect()
        console.log('Socket connection closed')
        socket = null
    }
}

export default socket