"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contacts_schema_1 = __importDefault(require("./contacts.schema"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    contacts: [contacts_schema_1.default],
    contactRequests: {
        sent: [{ type: mongoose_1.default.Schema.Types.ObjectId }],
        received: [{ type: mongoose_1.default.Schema.Types.ObjectId }]
    }
});
exports.default = userSchema;
//# sourceMappingURL=users.schema.js.map