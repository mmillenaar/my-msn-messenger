import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export default messageSchema