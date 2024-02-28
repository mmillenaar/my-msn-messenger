import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    chatId: {type: mongoose.Schema.Types.ObjectId}
})

export default contactSchema