import mongoose from 'mongoose'
import conversationSchema from './conversations.schema'

const userSchema = new mongoose.Schema({
    nickname: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    conversations: [conversationSchema]
})

export default userSchema