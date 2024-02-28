import logger from "../../config/logger.config"
import { handleNewMessage, logoutSocket, registerSocket, sendRetrievedChat } from "../../controllers/sockets.controller"
import { ChatMessageType } from "../../utils/types"


export default async function setupSocketListeners(socket) {
    socket.on('register-user',  (id: string) => {
        registerSocket(id, socket)
    })

    socket.on('get-chat-history', async (chatId: string) => {
        await sendRetrievedChat(socket, chatId)
    })

    socket.on('new-message', async ({ message, chatId }: { message: ChatMessageType, chatId?: string }) => {
        await handleNewMessage(message, chatId)
    })

    socket.on('logout', (userId: string) => {
        logger.info(`Client ${socket.id} disconnected`)
        logoutSocket(userId)
    })
}