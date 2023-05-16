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
                throw new Error('Error accessing database')
            }
        } catch (err) {
            logger.error(err);
            throw err
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
            throw err
        }
    }
    async getElementByValue(field: string, value: any) {
        // ensureDbConnection()
        try {
            const foundElement = await this.collection.findOne({ [field] : value}).select('-__v').lean()
            if (foundElement) {
                return foundElement
            }
        } catch (err) {
            logger.error(err);
            throw err
        }
    }
    async save(object: {}) {
        // ensureDbConnection()
        try {
            const newObjectSchema = new this.collection(object)
            const savedElement = await newObjectSchema.save()
            if (savedElement) {
                return this.getById(savedElement._id)
            }
            else {
                throw new Error(`Error saving element: ${object}`)
            }
        } catch (err) {
            logger.error(err);
            throw err
        }
    }
    async update(object: {}, id: string) {
        // ensureDbConnection()
        try {
            const updatedElement = await this.collection.replaceOne({ _id: id }, object)
            logger.info(updatedElement); // TODO: check what is the return
            return this.getById(id)
        } catch (err) {
            throw err
        }
    }
    async deleteById(id: string) {
        // ensureDbConnection()
        try {
            const deletedElement = await this.collection.deleteOne({ _id: id })
            logger.info(deletedElement); // TODO: check what is the return
            return this.getAll()
        } catch (err) {
            throw err
        }
    }
    async deleteAll() {
        // ensureDbConnection()
        try {
            await this.collection.deleteMany({})
            return this.getAll()
        }
        catch (err) {
            throw err
        }
    }
    async checkIsDuplicate(field: string, value: any) {
        // ensureDbConnection()
        try {
            const element = await this.getElementByValue(field, value)
            if (element) {
                return true
            }
            else {
                return false
            }
        }
        catch (err) {
            logger.error(err)
            throw err
        }
    }
}