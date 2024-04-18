import { Socket } from "socket.io";
import { chatsApi } from "../services/chats.api";
import { ChatMessageType, ChatType } from "../utils/types";
import { usersApi } from "../services/users.api";
import { UserStatus, UserUpdateFields } from "../utils/constants";

// TODO: handle errors

// Map of user id to socket object
export const userSockets = new Map()
// Map of socket id to user id (for usage with 'disconnect' event were no argument can be passed)
const socketIdUsers = new Map()

export const registerSocket = async (userId: string, socket: Socket) => {
    // add user to maps
    userSockets.set(userId, socket)
    socketIdUsers.set(socket.id, userId)

    // update user status to online
    return await usersApi.updateUser(userId, UserUpdateFields.STATUS, UserStatus.ONLINE)
}

export const handleUserStatusChange = async (userId: string, newStatus: string, socket: Socket) => {
    const updatedUser = await usersApi.updateUser(userId, UserUpdateFields.STATUS, newStatus)

    const userforClient = await usersApi.setupUserForClient(updatedUser)

    socket.emit('new-user-status', userforClient)

    // TODO: send new user status to all connected users
}

export const sendRetrievedChat = async (socket: Socket, chatId?: string) => {
    if (!chatId) {
        // TODO: return socket.emit('error', 'Failure retrieving chat data, please try again')
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
        // TODO: handle event when recipient is not online (message status)
    } else {
        // TODO: notification
        await sendRetrievedChat(recipientSocket, savedChat._id)
    }
}

export const notifyTyping = (isTyping: boolean, userId: string) => {
    const contactSocket = userSockets.get(userId)
    contactSocket.emit('typing', isTyping)
}

export const logoutSocket = async (socketId: string) => {
    const userId = socketIdUsers.get(socketId)

    // delete user from maps
    userSockets.delete(userId)
    socketIdUsers.delete(socketId)

    //update user status to offline
    await usersApi.updateUser(userId, UserUpdateFields.STATUS, UserStatus.OFFLINE)
}