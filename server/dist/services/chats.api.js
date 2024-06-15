"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatsApi = void 0;
const chats_schema_1 = __importDefault(require("../models/chats.schema"));
const mongoDb_container_1 = __importDefault(require("../persistence/mongoDb.container"));
const users_api_1 = require("./users.api");
class ChatsApi extends mongoDb_container_1.default {
    constructor() {
        super('chats', chats_schema_1.default);
    }
    async retrieveChatData(chatId) {
        return await this.getById(chatId);
    }
    async saveMessage(message, chatId) {
        if (!chatId) {
            const sortedParticipants = [message.senderId, message.recipientId].sort();
            const newChat = {
                participantsIds: sortedParticipants,
                messages: [message]
            };
            const savedChat = await super.save(newChat);
            // populate user and contact with chat ID
            await users_api_1.usersApi.addChatId(message.senderId, message.recipientId, savedChat._id);
            return savedChat;
        }
        const chat = await this.retrieveChatData(chatId);
        const updatedChat = {
            ...chat,
            messages: [...chat.messages, message]
        };
        return await super.update(updatedChat, chat._id);
    }
    async populateChat(chat) {
        // Populate participants
        const participantsPromises = chat.participantsIds.map(async (participantId) => {
            const user = await users_api_1.usersApi.getById(participantId);
            return {
                id: participantId,
                username: user.username,
                email: user.email,
            };
        });
        const populatedParticipants = await Promise.all(participantsPromises);
        // Populate messages
        const populatedMessages = chat.messages.map(message => {
            const sender = populatedParticipants.find(participant => participant.id === message.senderId);
            const recipient = populatedParticipants.find(participant => participant.id === message.recipientId);
            const { senderId, recipientId, ...restMessage } = message;
            return {
                ...restMessage,
                sender: sender,
                recipient: recipient
            };
        });
        const { participantsIds, ...restChat } = chat;
        return {
            ...restChat,
            participants: populatedParticipants,
            messages: populatedMessages,
        };
    }
    async setupChatForClient(chat) {
        const populatedChat = await this.populateChat(chat);
        if (!chat._id) {
            return populatedChat;
        }
        const { _id, ...rest } = populatedChat;
        return {
            id: _id,
            ...rest,
        };
    }
}
exports.chatsApi = new ChatsApi();
//# sourceMappingURL=chats.api.js.map