import mongoose from 'mongoose'
import chatSchema from './chats.schema'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    chats: [chatSchema],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    contactRequests: {
        sent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        received: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
})

export default userSchema