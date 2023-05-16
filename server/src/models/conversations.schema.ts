import mongoose from "mongoose";
import messageSchema from "./messages.schema";

const conversationSchema = new mongoose.Schema({
    participants: { type: [String], required: true },
    messages: [messageSchema],
})

export default conversationSchema