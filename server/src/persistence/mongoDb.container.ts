import mongoose, { Schema } from 'mongoose'
import { dbConfig } from '../config/db.config'
import logger from '../config/logger.config'


const connect = async () => {
    try {
        await mongoose.connect(dbConfig.URL, dbConfig.options)

        logger.info('MongoDb connected')
    }
    catch (err) {
        throw new Error(`Db connection error: ${err}`)
    }
}
connect()

// Utility function to convert ObjectIds to strings
function convertObjectIdsToStrings(obj: any) {
    if (obj instanceof mongoose.Types.ObjectId) {
        return obj.toString()
    } else if (Array.isArray(obj)) {
        return obj.map(element => convertObjectIdsToStrings(element));
    } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
            obj[key] = convertObjectIdsToStrings(obj[key])
        })
    }
    return obj
}

export default class MongoDbContainer {
    private collection

    constructor(collectionName: string, schema: Schema) {
        this.collection = mongoose.model(collectionName, schema)
    }

    async getAll() {
        try {
            const allContent = await this.collection.find().select('-__v').lean()
            if (allContent) {
                return allContent.map(doc => convertObjectIdsToStrings(doc));
            }
            else {
                throw new Error(`Error getting all elements`)
            }
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async getById(id: string) {
        try {
            const foundElement = await this.collection.findById(id).select('-__v').lean()
            if (foundElement) {
                // mongoose returns an object with _ids as ObjectId types, we need strings
                return convertObjectIdsToStrings(foundElement)
            }
            else {
                throw new Error(`Element with id: ${id} not found`)
            }
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async getElementByValue(field: string, value: any) {
        try {
            const foundElement = await this.collection.findOne({ [field] : value}).select('-__v').lean()
            if (!foundElement) {
                return null
            }
            // mongoose returns an object with _ids as ObjectId types, we need strings
            return convertObjectIdsToStrings(foundElement)
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async save(object: {}) {
        try {
            const newObjectSchema = new this.collection(object)
            const savedElement = await newObjectSchema.save()

            if (!savedElement) {
                throw new Error(`Error saving element: ${JSON.stringify(object)}`)
            }

            const retrievedElement = await this.getById(savedElement._id) // TODO: check why retrieving element again
            if (!retrievedElement) {
                throw new Error(`Error retrieving saved element: ${JSON.stringify(object)}`)
            }
            // mongoose returns an object with _ids as ObjectId types, we need strings
            return retrievedElement
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async update(object: {}, id: string) {
        try {
            const updatedElement = await this.collection.updateOne({ _id: id }, object)

            if (!updatedElement) {
                throw new Error(`Error updating element with id: ${id}`)
            }

            return this.getById(id)
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async deleteById(id: string) {
        try {
            const deletedElement = await this.collection.deleteOne({ _id: id })
            logger.info(deletedElement); // TODO: check what is the return

            if (!deletedElement) {
                throw new Error(`Error deleting element with id: ${id}`)
            }

            return this.getAll()
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async deleteAll() {
        try {
            const deletion = await this.collection.deleteMany({})
            if (deletion.deletedCount === 0) {
                throw new Error('Error deleting all elements')
            }

            return this.getAll()
        }
        catch (err) {
            logger.error(err);

            return null
        }
    }
    async checkIsDuplicate(field: string, value: any) {
        try {
            const element = await this.getElementByValue(field, value)

            if (!element) {
                return false
            }
            else {
                return true
            }
        }
        catch (err) {
            logger.error(err)

            return null
        }
    }
}