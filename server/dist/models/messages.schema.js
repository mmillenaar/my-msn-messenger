"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now, required: true },
});
exports.default = messageSchema;
//# sourceMappingURL=messages.schema.js.map