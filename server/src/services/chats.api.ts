import chatSchema from "../models/chats.schema";
import MongoDbContainer from "../persistence/mongoDb.container";
import { ChatMessageType, ChatType, UserType } from "../utils/types";
import { usersApi } from "./users.api";

class ChatsApi extends MongoDbContainer {
    constructor() {
        super('chats', chatSchema)
    }

    async retrieveChatData(chatId: string) {
        return await this.getById(chatId)
    }
    async saveMessage(message: ChatMessageType, chatId?: string) {
        if (!chatId) {
            const sortedParticipants = [message.senderId, message.recipientId].sort()
            const newChat = {
                participantsIds: sortedParticipants,
                messages: [message]
            }
            const savedChat: ChatType = await super.save(newChat)

            // populate user and contact with chat ID
            await usersApi.addChatId(message.senderId, message.recipientId, savedChat._id)

            return savedChat
        }

        const chat = await this.retrieveChatData(chatId)
        const updatedChat = {
            ...chat,
            messages: [...chat.messages, message]
        }

        return await super.update(updatedChat, chat._id)
    }
    async populateChat(chat: ChatType) {
        // Populate participants
        const participantsPromises = chat.participantsIds.map(async (participantId) => {
            const user: UserType = await usersApi.getById(participantId)

            return {
                id: participantId,
                username: user.username,
                email: user.email,
            }
        })

        const populatedParticipants = await Promise.all(participantsPromises)

        // Populate messages
        const populatedMessages = chat.messages.map(message => {
            const sender = populatedParticipants.find(participant => participant.id === message.senderId)
            const recipient = populatedParticipants.find(participant => participant.id === message.recipientId)

            const { senderId, recipientId, ...restMessage } = message

            return {
                ...restMessage,
                sender: sender,
                recipient: recipient
            }
        })

        const { participantsIds, ...restChat } = chat

        return {
            ...restChat,
            participants: populatedParticipants,
            messages: populatedMessages,
        }
    }
    async setupChatForClient(chat: ChatType) {
        const populatedChat = await this.populateChat(chat)

        if (!chat._id) {
            return populatedChat
        }

        const { _id, ...rest } = populatedChat

        return {
            id: _id,
            ...rest,
        }
    }

}

export const chatsApi = new ChatsApi()