import mongoose from 'mongoose'

const messagesSchema = new mongoose.Schema(
    {
        username: { type: String, require: true },
        date: { type: Date, require: true },
        message: { type: String, require: true },
    },
)

export default messagesSchema