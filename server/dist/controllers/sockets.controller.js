"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSocket = exports.notifyTyping = exports.handleNewMessage = exports.sendRetrievedChat = exports.handleUserStatusChange = exports.registerSocket = exports.userSockets = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const chats_api_1 = require("../services/chats.api");
const users_api_1 = require("../services/users.api");
const constants_1 = require("../utils/constants");
const logger_config_1 = __importDefault(require("../config/logger.config"));
// TODO: handle errors
const lock = new async_lock_1.default();
const lockKey = 'socketMaps';
// Map of user id to socket object
exports.userSockets = new Map();
// Map of socket id to user id (for usage with 'disconnect' event were no argument can be passed)
const socketIdUsers = new Map();
const registerSocket = async (userId, socket) => {
    // add user to maps
    await lock.acquire(lockKey, () => {
        exports.userSockets.set(userId, socket);
        socketIdUsers.set(socket.id, userId);
    });
};
exports.registerSocket = registerSocket;
const handleUserStatusChange = async (userId, newStatus, socket) => {
    // get user to check previous status for notification usage
    const user = await users_api_1.usersApi.getById(userId);
    // update user status
    const updatedUser = await users_api_1.usersApi.updateUser(userId, constants_1.UserUpdateFields.STATUS, newStatus);
    const userforClient = await users_api_1.usersApi.setupUserForClient(updatedUser);
    // emit change to other users
    exports.userSockets.forEach(async (userSocket) => {
        const contactId = socketIdUsers.get(userSocket.id);
        // check if user exists in contacts
        if (!updatedUser.contacts.find(contact => contact._id === contactId))
            return;
        // get contact with updated user status
        const updatedContact = await users_api_1.usersApi.getById(contactId);
        const contactForClient = await users_api_1.usersApi.setupUserForClient(updatedContact);
        if (user.status === constants_1.UserStatus.OFFLINE && newStatus === constants_1.UserStatus.ONLINE) {
            userSocket.emit('new-user-connected', ({ contactUsername: updatedUser.username, updatedUser: contactForClient }));
        }
        else {
            userSocket.emit('new-user-status', contactForClient);
        }
    });
    // emit change to current user
    socket.emit('new-user-status', userforClient);
};
exports.handleUserStatusChange = handleUserStatusChange;
const sendRetrievedChat = async (socket, chatId) => {
    if (!chatId) {
        // TODO: return socket.emit('error', 'Failure retrieving chat data, please try again')
        return;
    }
    const retrievedChat = await chats_api_1.chatsApi.retrieveChatData(chatId);
    const chatForClient = await chats_api_1.chatsApi.setupChatForClient(retrievedChat);
    socket.emit('chat-render', chatForClient);
    return chatForClient;
};
exports.sendRetrievedChat = sendRetrievedChat;
const handleNewMessage = async (message, chatId) => {
    const savedChat = await chats_api_1.chatsApi.saveMessage(message, chatId);
    if (!savedChat) {
        return logger_config_1.default.error('failed saving message');
    }
    const senderSocket = exports.userSockets.get(message.senderId);
    const recipientSocket = exports.userSockets.get(message.recipientId);
    await (0, exports.sendRetrievedChat)(senderSocket, savedChat._id);
    if (!recipientSocket) {
        // TODO: handle event when recipient is not online (message status)
    }
    else {
        const chat = await (0, exports.sendRetrievedChat)(recipientSocket, savedChat._id);
        const senderUsername = chat.messages[chat.messages.length - 1].sender.username;
        const senderId = chat.messages[chat.messages.length - 1].sender.id;
        recipientSocket.emit('incoming-message', {
            user: {
                username: senderUsername,
                id: senderId
            },
            message: message.text
        });
    }
};
exports.handleNewMessage = handleNewMessage;
const notifyTyping = (isTyping, userId) => {
    const contactSocket = exports.userSockets.get(userId);
    if (contactSocket) {
        contactSocket.emit('typing', isTyping);
    }
};
exports.notifyTyping = notifyTyping;
const logoutSocket = async (socket) => {
    const userId = socketIdUsers.get(socket.id);
    if (userId) {
        // delete user from maps
        await lock.acquire(lockKey, () => {
            exports.userSockets.delete(userId);
            socketIdUsers.delete(socket.id);
        });
        //update user status to offline
        await (0, exports.handleUserStatusChange)(userId, constants_1.UserStatus.OFFLINE, socket);
    }
};
exports.logoutSocket = logoutSocket;
//# sourceMappingURL=sockets.controller.js.map