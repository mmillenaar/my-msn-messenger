import mongoose from 'mongoose'
import chatSchema from './chats.schema'
import contactSchema from './contacts.schema'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    chats: [chatSchema],
    contacts: [contactSchema],
    contactRequests: {
        sent: [{ type: mongoose.Schema.Types.ObjectId }],
        received: [{ type: mongoose.Schema.Types.ObjectId }]
    }
})

export default userSchema