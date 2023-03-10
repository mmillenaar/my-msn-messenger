import messagesSchema from "../models/messages.schema";
import MongoDbContainer from "../persistence/mongoDb.container";

export const messagesContainer = new MongoDbContainer('messages', messagesSchema)