import logger from "../../config/logger.config"
import { handleNewMessage, logoutSocket, registerSocket, sendRetrievedChat } from "../../controllers/sockets.controller"
import { ChatMessageType } from "../../utils/types"


export default async function setupSocketListeners(socket) {
    socket.on('register-user',  (id: string) => {
        registerSocket(id, socket)
    })

    socket.on('get-chat-history', async (senderId: string, recipientId: string) => {
        await sendRetrievedChat(senderId, recipientId, socket)
    })

    socket.on('new-message', async (message: ChatMessageType) => {
        await handleNewMessage(message)
    })

    socket.on('logout', (userId: string) => {
        logger.info(`Client ${socket.id} disconnected`)
        logoutSocket(userId)
    })
}