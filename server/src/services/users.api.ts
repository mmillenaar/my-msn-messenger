import bcrypt from 'bcrypt'
import logger from '../config/logger.config';
import userSchema from "../models/users.schema";
import MongoDbContainer from "../persistence/mongoDb.container";
import { ContactRequestActions } from '../utils/constants';

class UsersApi extends MongoDbContainer {
    constructor() {
        super('users', userSchema)
    }

    async getUserByEmail(email: string) {
        try {
            const user = await super.getElementByValue('email', email)
            return user
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async authenticateUser(email: string, password: string) {
        try {
            const user = await this.getUserByEmail(email)
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return { error: 'Invalid email or password', status: 401 }
            }
            return { user: user }
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async registerUser(userData: any) { // TODO: sepecify USERDATA TYPE
        try {
            const isDuplicateEmail = await super.checkIsDuplicate('email', userData.email)
            const isDuplicateUsername = await super.checkIsDuplicate('username', userData.username)

            if (isDuplicateEmail) {
                return { error: 'Email already exists', status: 409 }
            } else if (isDuplicateUsername) {
                return { error: 'Username already exists', status: 409 }
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
            const newUser = {
                ...userData,
                password: hashedPassword
            }
            const savedUser = await super.save(newUser)

            if (!savedUser) {
                throw new Error('Error saving the registered user')
            }

            return { user: savedUser }
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }

    async handleContactRequest(userId: string, contactId: string, action: string) {
        try {
            const user = await super.getById(userId)
            const contact = await super.getById(contactId)

            const deleteContactRequests = () => {
                user.contactRequests.sent = user.contactRequests.sent.filter(
                    (id) => id !== contactId
                )
                contact.contactRequests.received = contact.contactRequests.received.filter(
                    (id) => id !== userId
                )
            }

            switch (action) {
                case ContactRequestActions.SEND:
                    user.contactRequests.sent.push(contactId)

                    break
                case ContactRequestActions.RECEIVE:
                    user.contactRequests.received.push(contactId)

                    break
                case ContactRequestActions.ACCEPT:
                    user.contacts.push(contactId)
                    contact.contacts.push(userId)

                    deleteContactRequests()

                    break
                case ContactRequestActions.REJECT:
                    deleteContactRequests()

                    break
                default:
                    break
            }

            return super.save(user)
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
}

export const usersApi = new UsersApi()