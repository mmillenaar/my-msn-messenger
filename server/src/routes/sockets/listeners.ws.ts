import { Socket } from "socket.io"
import logger from "../../config/logger.config"
import { handleNewMessage, handleUserStatusChange, logoutSocket, notifyTyping, registerSocket, sendRetrievedChat } from "../../controllers/sockets.controller"
import { UserStatus } from "../../utils/constants"
import { ChatMessageType } from "../../utils/types"


export default async function setupSocketListeners(socket: Socket) {
    socket.on('register-user',  async (id: string) => {
        await registerSocket(id, socket)

        // update user status because it now changes to online
        await handleUserStatusChange(id, UserStatus.ONLINE, socket)
    })

    socket.on('user-status-change', async ({ userId, newStatus }: { userId: string, newStatus: UserStatus }) => {
        await handleUserStatusChange(userId, newStatus, socket)
    })

    socket.on('get-chat-history', async (chatId: string) => {
        await sendRetrievedChat(socket, chatId)
    })

    socket.on('new-message', async ({ message, chatId }: { message: ChatMessageType, chatId?: string }) => {
        await handleNewMessage(message, chatId)
    })

    socket.on('user-typing', ({ isTyping, userId }: { isTyping: boolean, userId: string }) => {
        notifyTyping(isTyping, userId)
    })

    socket.on('logout', () => {
        socket.disconnect()
    })

    socket.on('disconnect', async (reason) => {
        logger.info(`Client ${socket.id} disconnected. Reason: ${reason}`)
        await logoutSocket(socket)
    })
}