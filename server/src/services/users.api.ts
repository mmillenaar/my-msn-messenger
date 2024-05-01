import bcrypt from 'bcrypt'
import logger from '../config/logger.config';
import userSchema from "../models/users.schema";
import MongoDbContainer from "../persistence/mongoDb.container";
import { ContactRequestActions, UserStatus } from '../utils/constants';
import { ContactForClientType, ContactRequestForClientType, ContactType, UserType } from '../utils/types';

class UsersApi extends MongoDbContainer {
    constructor() {
        super('users', userSchema)
    }

    async getUserByEmail(email: string) {
        try {
            const user: UserType = await super.getElementByValue('email', email)
            return user
        }
        catch (err) {
            logger.error(err)

            // TODO: check errors!!
            // return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async authenticateUser(email: string, password: string) {
        try {
            const user: UserType = await this.getUserByEmail(email)

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return { error: 'Invalid email or password', status: 401 }
            } else {
                return { user: user }
            }
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async registerUser(userData: any) { // TODO: sepecify USERDATA TYPE
        try {
            const isDuplicateEmail: boolean = await super.checkIsDuplicate('email', userData.email)
            const isDuplicateUsername: boolean = await super.checkIsDuplicate('username', userData.username)

            if (isDuplicateEmail) {
                return { error: 'Email already exists', status: 409 }
            } else if (isDuplicateUsername) {
                return { error: 'Username already exists', status: 409 }
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
            const newUser: UserType = {
                ...userData,
                password: hashedPassword,
                status: UserStatus.ONLINE
            }
            const savedUser: UserType = await super.save(newUser)

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
            const user: UserType = await super.getById(userId)
            const contact: UserType = await super.getById(contactId)

            const deleteContactRequests = () => {
                user.contactRequests.received = user.contactRequests.received.filter(
                    (id) => id != contactId
                )
                contact.contactRequests.sent = contact.contactRequests.sent.filter(
                    (id) => id != userId
                )
            }
            const checkContactRequestValidity = () => {
                if (user.contacts.filter(contact => JSON.stringify(contact._id) === contactId).length > 0 ||
                    user.contactRequests.sent.includes(contactId) ||
                    user.contactRequests.received.includes(contactId)) {

                    return false
                } else {
                    return true
                }
            }

            switch (action) {
                case ContactRequestActions.SEND:
                    if (checkContactRequestValidity()) {
                        user.contactRequests.sent.push(contactId)
                    } else {
                        return null
                    }

                    break
                case ContactRequestActions.RECEIVE:
                    user.contactRequests.received.push(contactId)

                    break
                case ContactRequestActions.ACCEPT:
                    user.contacts.push({_id: contactId})
                    contact.contacts.push({_id: userId})

                    deleteContactRequests()

                    break
                case ContactRequestActions.REJECT:
                    deleteContactRequests()

                    break
                default:
                    break
            }

            await super.update(contact, contactId)
            return await super.update(user, userId)
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async populateContactRequests(user: UserType) {
        const contactRequestPromises = user.contactRequests.received.map(async (id) => {
            const contact: UserType = await super.getById(id)

            return {
                username: contact.username,
                email: contact.email,
                id: contact._id,
            }
        })
        const populatedContactRequests: ContactRequestForClientType[] = await Promise.all(contactRequestPromises)

        return populatedContactRequests
    }
    async populateContacts(user: UserType) {
        const contactPromises = user.contacts.map(async (contact: ContactType) => {
            const searchedContact = await super.getById(contact._id)

            return {
                username: searchedContact.username,
                email: searchedContact.email,
                id: contact._id,
                chatId: contact.chatId,
                status: searchedContact.status
            }
        })
        const populatedContacts: ContactForClientType[] = await Promise.all(contactPromises)

        return populatedContacts
    }
    async populateUser(user: UserType) {
        const populatedUserContacts = await this.populateContacts(user)
        const populatedUserContactRequests = await this.populateContactRequests(user)

        return {
            ...user,
            contacts: populatedUserContacts,
            contactRequests: {
                sent: user.contactRequests.sent,
                received: populatedUserContactRequests
            }
        }
    }
    async setupUserForClient(user: UserType) {
        //populate user
        const populatedUser = await this.populateUser(user)

        //remove password
        const { password, _id, ...rest } = populatedUser

        // change ID denomination
        const userForClient = {
            id: _id,
            ...rest
        }

        return userForClient
    }
    async addChatId(userId: string, contactId: string, chatId: string) {
        try {
            const user: UserType = await super.getById(userId)
            const contact: UserType = await super.getById(contactId)

            // Modify user's contacts
            user.contacts.forEach(contactItem => {
                if (contactItem._id.toString() === contactId) {
                    contactItem.chatId = chatId;
                }
            });

            // Modify contact's contacts
            contact.contacts.forEach(contactItem => {
                if (contactItem._id.toString() === userId) {
                    contactItem.chatId = chatId;
                }
            });

            await super.update(contact, contactId)
            return await super.update(user, userId)
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async updateUser(id: string, field: string, value: any) {
        try {
            const user: UserType = await super.getById(id)

            if (field === 'password') {
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(value, saltRounds)
                user[field] = hashedPassword
            } else {
                user[field] = value
            }

            return await super.update(user, id)
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async findContactMatches(userId: string, query: string) {
        try {
            const user: UserType = await super.getById(userId)
            const populatedUserContacts = await this.populateContacts(user)

            const matches = populatedUserContacts.filter(contact => contact.username.includes(query) || contact.email.includes(query))

            return matches
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError, please try again', status: 500 }
        }
    }
}

export const usersApi = new UsersApi()