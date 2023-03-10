import mongoose, { Schema } from 'mongoose'
import { dbConfig } from '../config/db.config'

let isDbConnected: boolean = false

const connect = async () => {
    try {
        await mongoose.connect(dbConfig.URL, dbConfig.options)
        console.log('MongoDb connected')
        isDbConnected = true
    }
    catch (err) {
        throw new Error(`Db connection error: ${err}`)
    }
}

const ensureDbConnection = async () => {
    if (!isDbConnected) {
        await connect()
    }
}

export default class MongoDbContainer {
    private collection
    constructor(collectionName: string, schema: Schema) {
        ensureDbConnection().then(() => {
            this.collection = mongoose.model(collectionName, schema)
        })
    }

    async getAll() {
        await ensureDbConnection()
        try {
            const allContent = await this.collection.find().select('-__v').lean()
            if (allContent) {
                return allContent
            }
            else {
                throw new Error('Error accessing database')
            }
        } catch (err) {
            console.error(err);
        }
    }
    async getById(id: string) {
        await ensureDbConnection()
        try {
            const foundElement = await this.collection.findById(id).select('-__v').lean()
            if (foundElement) {
                return foundElement
            }
            else {
                throw new Error(`Element with id: ${id} not found`)
            }
        } catch (err) {
            console.error(err);
        }
    }
    async getElementByValue(field: string, value: any) {
        await ensureDbConnection()
        try {
            const foundElement = await this.collection.findOne({ [field] : value}).select('-__v').lean()
            if (foundElement) {
                return foundElement
            }
            else {
                throw new Error(`${value} not found in ${field}`)
            }
        } catch (err) {
            console.error(err);
        }
    }
    async save(object: {}) {
        await ensureDbConnection()
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
            console.error(err);
        }
    }
    async update(object: {}, id: string) {
        await ensureDbConnection()
        try {
            const updatedElement = await this.collection.replaceOne({ _id: id }, object)
            console.log(updatedElement); // TODO: check what is the return
            return this.getById(id)
        } catch (err) {
            throw err
        }
    }
    async deleteById(id: string) {
        await ensureDbConnection()
        try {
            const deletedElement = await this.collection.deleteOne({ _id: id })
            console.log(deletedElement); // TODO: check what is the return
            return this.getAll()
        } catch (err) {
            err.status = 404
            throw err
        }
    }
    async deleteAll() {
        await ensureDbConnection()
        try {
            await this.collection.deleteMany({})
            return this.getAll()
        }
        catch (err) {
            throw err
        }
    }
    async checkIsDuplicate(field: string, value: any) {
        await ensureDbConnection()
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
            console.error(err)
            throw err
        }
    }
}