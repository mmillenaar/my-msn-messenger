"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messages_schema_1 = __importDefault(require("./messages.schema"));
const chatSchema = new mongoose_1.default.Schema({
    participantsIds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messages_schema_1.default],
});
exports.default = chatSchema;
//# sourceMappingURL=chats.schema.js.map