import mongoose from 'mongoose'
import contactSchema from './contacts.schema'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    contacts: [contactSchema],
    contactRequests: {
        sent: [{ type: mongoose.Schema.Types.ObjectId }],
        received: [{ type: mongoose.Schema.Types.ObjectId }]
    }
})

export default userSchema