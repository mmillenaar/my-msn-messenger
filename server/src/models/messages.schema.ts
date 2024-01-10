import mongoose from 'mongoose'
import { MessageStatus } from '../utils/constants'

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    status: { type: String, required: true, enum: [MessageStatus.READ, MessageStatus.RECEIVED, MessageStatus.SENT] }
})

export default messageSchema