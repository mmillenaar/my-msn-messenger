import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    fontStyle: { type: String },
    isNudgeMessage: { type: Boolean, default: false }
})

export default messageSchema