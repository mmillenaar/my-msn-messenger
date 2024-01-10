import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
})

export default contactSchema