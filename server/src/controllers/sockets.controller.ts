import { Socket } from "socket.io";
import { chatsApi } from "../services/chats.api";
import { ChatMessageType, ChatType } from "../utils/types";

// TODO: handle errors

export const userSockets = new Map()

export const registerSocket = (userId: string, socket: Socket) => {
    userSockets.set(userId, socket)
}

export const sendRetrievedChat = async (socket: Socket, chatId?: string) => {
    if (!chatId) {
        // return socket.emit('error', 'Failure retrieving chat data, please try again')
        return
    }
    const retrievedChat = await chatsApi.retrieveChatData(chatId)
    const chatForCient = await chatsApi.setupChatForClient(retrievedChat)
    socket.emit('chat-render', chatForCient)
}

export const handleNewMessage = async (message: ChatMessageType, chatId?: string) => {
    const savedChat: ChatType = await chatsApi.saveMessage(message, chatId)
    if (!savedChat) {
        return // TODO: handle error
    }
    const senderSocket = userSockets.get(message.senderId)
    const recipientSocket = userSockets.get(message.recipientId)

    await sendRetrievedChat(senderSocket, savedChat._id)

    if (!recipientSocket) {
        // handle event when recipient is not online (message status)
    } else {
        // TODO: notification
        await sendRetrievedChat(recipientSocket, savedChat._id)
    }
}

export const logoutSocket = (userId: string) => {
    userSockets.delete(userId)
}