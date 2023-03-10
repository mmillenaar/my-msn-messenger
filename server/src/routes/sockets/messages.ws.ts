import { messagesContainer } from "../../controllers/messages.controller"

export default async function socketMessagesConfiguration(socket, sockets) {
    const chatData: [] = await messagesContainer.getAll()
    socket.emit('first-chat-render', chatData)

    socket.on('new-user-message', async message => {
        try {
            await messagesContainer.save(message)
            const newChatData: [] = await messagesContainer.getAll()
            sockets.emit('new-chat-message', newChatData)
        }
        catch (err) {
            console.error(err)
        }
    })
}