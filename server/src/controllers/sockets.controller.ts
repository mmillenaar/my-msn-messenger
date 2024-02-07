import { Socket } from "socket.io";
import { chatsApi } from "../services/chats.api";
import { ChatMessageType } from "../utils/types";

// TODO: handle errors

export const userSockets = new Map()

export const registerSocket = (userId: string, socket: Socket) => {
    userSockets.set(userId, socket)
}

export const sendRetrievedChat = async (senderId: string, recipientId: string, socket: Socket) => {
    const retrievedChat = await chatsApi.retrieveChatData(senderId, recipientId)
    if (!retrievedChat) {
        // return socket.emit('error', 'Failure retrieving chat data, please try again')
    }
    socket.emit('chat-render', retrievedChat)
}

export const handleNewMessage = async (message: ChatMessageType) => {
    const savedMessage = await chatsApi.saveMessage(message)
    if (!savedMessage) {
        return
    }
    const senderSocket = userSockets.get(message.senderId)
    const recipientSocket = userSockets.get(message.recipientId)

    sendRetrievedChat(message.senderId, message.recipientId, senderSocket)

    if (!recipientSocket) {
        // handle event when recipient is not online
    } else {
        sendRetrievedChat(message.senderId, message.recipientId, recipientSocket)
    }
}

export const logoutSocket = (userId: string) => {
    userSockets.delete(userId)
}