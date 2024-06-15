"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const logger_config_1 = __importDefault(require("../config/logger.config"));
const listeners_ws_1 = __importDefault(require("../routes/sockets/listeners.ws"));
const handleSocketConnection = (io) => {
    io.on('connection', async (socket) => {
        try {
            logger_config_1.default.info(`New client ${socket.id} connected`);
            await (0, listeners_ws_1.default)(socket);
        }
        catch (err) {
            logger_config_1.default.info(err);
        }
    });
};
exports.handleSocketConnection = handleSocketConnection;
//# sourceMappingURL=socketHandler.js.map