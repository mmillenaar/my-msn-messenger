import { Socket } from "socket.io";
import AsyncLock from "async-lock"
import { chatsApi } from "../services/chats.api";
import { ChatMessageType, ChatType, UserForClientType, UserType } from "../utils/types";
import { usersApi } from "../services/users.api";
import { UserStatus, UserUpdateFields } from "../utils/constants";
import logger from "../config/logger.config";

// TODO: handle errors

const lock = new AsyncLock()
const lockKey = 'socketMaps'

// Map of user id to socket object
export const userSockets = new Map<string, Socket>()
// Map of socket id to user id (for usage with 'disconnect' event were no argument can be passed)
const socketIdUsers = new Map<string, string>()

export const registerSocket = async (userId: string, socket: Socket) => {
    // add user to maps
    await lock.acquire(lockKey, () => {
        userSockets.set(userId, socket)
        socketIdUsers.set(socket.id, userId)
    })
}

export const handleUserStatusChange = async (userId: string, newStatus: string, socket: Socket) => {
    // get user to check previous status for notification usage
    const user: UserType = await usersApi.getById(userId)

    // update user status
    const updatedUser: UserType = await usersApi.updateUser(userId, UserUpdateFields.STATUS, newStatus)
    const userforClient: UserForClientType = await usersApi.setupUserForClient(updatedUser)

    // emit change to other users
    userSockets.forEach(async userSocket => {
        const contactId = socketIdUsers.get(userSocket.id)

        // check if user exists in contacts
        if (!updatedUser.contacts.find(contact => contact._id === contactId)) return

        // get contact with updated user status
        const updatedContact = await usersApi.getById(contactId)
        const contactForClient: UserForClientType = await usersApi.setupUserForClient(updatedContact)

        if (user.status === UserStatus.OFFLINE && newStatus === UserStatus.ONLINE) {
            userSocket.emit('new-user-connected', ({contactUsername: updatedUser.username, updatedUser: contactForClient}))
        } else {
            userSocket.emit('new-user-status', contactForClient)
        }
    })

    // emit change to current user
    socket.emit('new-user-status', userforClient)
}

export const sendRetrievedChat = async (socket: Socket, chatId: string) => {
    if (!chatId) {
        // TODO: return socket.emit('error', 'Failure retrieving chat data, please try again')
        return
    }
    const retrievedChat = await chatsApi.retrieveChatData(chatId)
    const chatForClient = await chatsApi.setupChatForClient(retrievedChat)
    socket.emit('chat-render', chatForClient)

    return chatForClient
}

export const handleNewMessage = async (message: ChatMessageType, chatId?: string) => {
    const savedChat: ChatType = await chatsApi.saveMessage(message, chatId)
    if (!savedChat) {
        return logger.error('failed saving message')
    }
    const senderSocket = userSockets.get(message.senderId)
    const recipientSocket = userSockets.get(message.recipientId)

    await sendRetrievedChat(senderSocket, savedChat._id)

    if (!recipientSocket) {
        // TODO: handle event when recipient is not online (message status)
    } else {
        const chat = await sendRetrievedChat(recipientSocket, savedChat._id)
        const senderUsername = chat.messages[chat.messages.length - 1].sender.username
        const senderId = chat.messages[chat.messages.length - 1].sender.id
        recipientSocket.emit('incoming-message', {
            user: {
                username: senderUsername,
                id: senderId
            },
            message: message.text
        })
    }
}

export const notifyTyping = (isTyping: boolean, userId: string) => {
    const contactSocket = userSockets.get(userId)
    if (contactSocket) {
        contactSocket.emit('typing', isTyping)
    }
}

export const logoutSocket = async (socket: Socket) => {
    const userId = socketIdUsers.get(socket.id)

    if (userId) {
        // delete user from maps
        await lock.acquire(lockKey, () => {
            userSockets.delete(userId)
            socketIdUsers.delete(socket.id)
        })

        //update user status to offline
        await handleUserStatusChange(userId, UserStatus.OFFLINE, socket)
    }
}