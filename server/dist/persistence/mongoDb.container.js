"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = require("../config/db.config");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const connect = async () => {
    try {
        await mongoose_1.default.connect(db_config_1.dbConfig.URL, db_config_1.dbConfig.options);
        logger_config_1.default.info('MongoDb connected');
    }
    catch (err) {
        throw new Error(`Db connection error: ${err}`);
    }
};
connect();
// Utility function to convert ObjectIds to strings
function convertObjectIdsToStrings(obj) {
    if (obj instanceof mongoose_1.default.Types.ObjectId) {
        return obj.toString();
    }
    else if (Array.isArray(obj)) {
        return obj.map(element => convertObjectIdsToStrings(element));
    }
    else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            obj[key] = convertObjectIdsToStrings(obj[key]);
        });
    }
    return obj;
}
class MongoDbContainer {
    constructor(collectionName, schema) {
        this.collection = mongoose_1.default.model(collectionName, schema);
    }
    async getAll() {
        try {
            const allContent = await this.collection.find().select('-__v').lean();
            if (allContent) {
                return allContent.map(doc => convertObjectIdsToStrings(doc));
            }
            else {
                throw new Error(`Error getting all elements`);
            }
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async getById(id) {
        try {
            const foundElement = await this.collection.findById(id).select('-__v').lean();
            if (foundElement) {
                // mongoose returns an object with _ids as ObjectId types, we need strings
                return convertObjectIdsToStrings(foundElement);
            }
            else {
                throw new Error(`Element with id: ${id} not found`);
            }
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async getElementByValue(field, value) {
        try {
            const foundElement = await this.collection.findOne({ [field]: value }).select('-__v').lean();
            if (!foundElement) {
                return null;
            }
            // mongoose returns an object with _ids as ObjectId types, we need strings
            return convertObjectIdsToStrings(foundElement);
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async save(object) {
        try {
            const newObjectSchema = new this.collection(object);
            const savedElement = await newObjectSchema.save();
            if (!savedElement) {
                throw new Error(`Error saving element: ${JSON.stringify(object)}`);
            }
            const retrievedElement = await this.getById(savedElement._id); // TODO: check why retrieving element again
            if (!retrievedElement) {
                throw new Error(`Error retrieving saved element: ${JSON.stringify(object)}`);
            }
            // mongoose returns an object with _ids as ObjectId types, we need strings
            return retrievedElement;
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async update(object, id) {
        try {
            const updatedElement = await this.collection.updateOne({ _id: id }, object);
            if (!updatedElement) {
                throw new Error(`Error updating element with id: ${id}`);
            }
            return this.getById(id);
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async deleteById(id) {
        try {
            const deletedElement = await this.collection.deleteOne({ _id: id });
            logger_config_1.default.info(deletedElement); // TODO: check what is the return
            if (!deletedElement) {
                throw new Error(`Error deleting element with id: ${id}`);
            }
            return this.getAll();
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async deleteAll() {
        try {
            const deletion = await this.collection.deleteMany({});
            if (deletion.deletedCount === 0) {
                throw new Error('Error deleting all elements');
            }
            return this.getAll();
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
    async checkIsDuplicate(field, value) {
        try {
            const element = await this.getElementByValue(field, value);
            if (!element) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (err) {
            logger_config_1.default.error(err);
            return null;
        }
    }
}
exports.default = MongoDbContainer;
//# sourceMappingURL=mongoDb.container.js.map