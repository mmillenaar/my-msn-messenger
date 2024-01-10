import mongoose from "mongoose";
import messageSchema from "./messages.schema";

const chatSchema = new mongoose.Schema({
    participantsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageSchema],
})

export default chatSchema