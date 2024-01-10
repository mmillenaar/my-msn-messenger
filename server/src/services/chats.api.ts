import chatSchema from "../models/chats.schema";
import MongoDbContainer from "../persistence/mongoDb.container";
import { ChatMessageTypes } from "../utils/types";

class ChatsApi extends MongoDbContainer {
    constructor() {
        super('chats', chatSchema)
    }

    async retrieveChatData(senderId: string, recipientId: string) {
        const sortedParticipants = [senderId, recipientId].sort()

        return await this.getElementByValue('participantsIds', sortedParticipants)
    }
    async saveMessage(message: ChatMessageTypes) {
        const chat = await this.retrieveChatData(message.senderId, message.recipientId)
        if (!chat) {
            return null
        }
        const updatedChat = {
            ...chat,
            messages: [...chat.messages, message]
        }

        return await chatsApi.save(updatedChat)
    }

}

export const chatsApi = new ChatsApi()