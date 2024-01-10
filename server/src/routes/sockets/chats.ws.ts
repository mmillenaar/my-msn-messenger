import logger from "../../config/logger.config"
import { handleNewMessage, logoutSocket, registerSocket, sendRetrievedChat } from "../../controllers/chats.controller"
import { ChatMessageTypes } from "../../utils/types"


export default async function handleSocketChat(socket) {
    socket.on('register-user', (id: string) => {
        registerSocket(id, socket)
    })

    socket.on('get-chat-history', (senderId: string, recipientId: string) => {
        sendRetrievedChat(senderId, recipientId, socket)
    })

    socket.on('new-message', async (message: ChatMessageTypes) => {
        handleNewMessage(message)
    })
    socket.on('logout', (userId: string) => {
        logoutSocket(userId)
        logger.info(`Client ${socket.id} disconnected`)
    })
}