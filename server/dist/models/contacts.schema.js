"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    chatId: { type: mongoose_1.default.Schema.Types.ObjectId },
    isBlocked: { type: Boolean },
    hasBlockedMe: { type: Boolean }
});
exports.default = contactSchema;
//# sourceMappingURL=contacts.schema.js.map