"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_config_1 = __importDefault(require("../../config/logger.config"));
const sockets_controller_1 = require("../../controllers/sockets.controller");
const constants_1 = require("../../utils/constants");
async function setupSocketListeners(socket) {
    socket.on('register-user', async (id) => {
        await (0, sockets_controller_1.registerSocket)(id, socket);
        // update user status because it now changes to online
        await (0, sockets_controller_1.handleUserStatusChange)(id, constants_1.UserStatus.ONLINE, socket);
    });
    socket.on('user-status-change', async ({ userId, newStatus }) => {
        await (0, sockets_controller_1.handleUserStatusChange)(userId, newStatus, socket);
    });
    socket.on('get-chat-history', async (chatId) => {
        await (0, sockets_controller_1.sendRetrievedChat)(socket, chatId);
    });
    socket.on('new-message', async ({ message, chatId }) => {
        await (0, sockets_controller_1.handleNewMessage)(message, chatId);
    });
    socket.on('user-typing', ({ isTyping, userId }) => {
        (0, sockets_controller_1.notifyTyping)(isTyping, userId);
    });
    socket.on('logout', () => {
        socket.disconnect();
    });
    socket.on('disconnect', async (reason) => {
        logger_config_1.default.info(`Client ${socket.id} disconnected. Reason: ${reason}`);
        await (0, sockets_controller_1.logoutSocket)(socket);
    });
}
exports.default = setupSocketListeners;
//# sourceMappingURL=listeners.ws.js.map