import logger from "../../config/logger.config"
import { messagesContainer } from "../../controllers/messages.controller"

export default async function handleSocketChat(socket, sockets) {
    const chatData = await messagesContainer.getAll()
    if (!chatData) {
        socket.emit('error', 'Failure retrieving chat data, please try again')

        return
    }
    socket.emit('first-chat-render', chatData)

    socket.on('new-user-message', async message => {
        try {
            const savedMessage = await messagesContainer.save(message)
            if (!savedMessage) {
                socket.emit('error', 'Failure saving message, please try again')

                return
            }
            const newChatData = await messagesContainer.getAll()
            if (!newChatData) {
                socket.emit('error', 'Failure retrieving new chat data, please try again')

                return
            }
            sockets.emit('new-chat-message', newChatData)
        }
        catch (err) {
            logger.error(err)

            socket.emit('error', 'ServerError, please try again')
        }
    })
}