import mongoose, { Schema } from 'mongoose'
import { dbConfig } from '../config/db.config'
import logger from '../config/logger.config'

// let isDbConnected: boolean = false

const connect = async () => {
    try {
        await mongoose.connect(dbConfig.URL, dbConfig.options)
        // isDbConnected = true
        logger.info('MongoDb connected')
    }
    catch (err) {
        throw new Error(`Db connection error: ${err}`)
    }
}
connect()

// const ensureDbConnection = async () => {
//     if (!isDbConnected) {
//         await connect()
//     }
// }
// ensureDbConnection()

export default class MongoDbContainer {
    private collection
    constructor(collectionName: string, schema: Schema) {
        this.collection = mongoose.model(collectionName, schema)
    }

    async getAll() {
        // ensureDbConnection()
        try {
            const allContent = await this.collection.find().select('-__v').lean()
            if (allContent) {
                return allContent
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
        // ensureDbConnection()
        try {
            const foundElement = await this.collection.findById(id).select('-__v').lean()
            if (foundElement) {
                return foundElement
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
        // ensureDbConnection()
        try {
            const foundElement = await this.collection.findOne({ [field] : value}).select('-__v').lean()
            if (!foundElement) {
                throw new Error(`Element with ${field}: ${value} not found`)
            }

            return foundElement
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async save(object: {}) {
        // ensureDbConnection()
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

            return retrievedElement
        } catch (err) {
            logger.error(err);

            return null
        }
    }
    async update(object: {}, id: string) {
        // ensureDbConnection()
        try {
            const updatedElement = await this.collection.replaceOne({ _id: id }, object)
            logger.info(updatedElement); // TODO: check what is the return

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
        // ensureDbConnection()
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
        // ensureDbConnection()
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
        // ensureDbConnection()
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