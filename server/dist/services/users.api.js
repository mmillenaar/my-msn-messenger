"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersApi = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
const users_schema_1 = __importDefault(require("../models/users.schema"));
const mongoDb_container_1 = __importDefault(require("../persistence/mongoDb.container"));
const constants_1 = require("../utils/constants");
class UsersApi extends mongoDb_container_1.default {
    constructor() {
        super('users', users_schema_1.default);
    }
    async getUserByEmail(email) {
        try {
            const user = await super.getElementByValue('email', email);
            return user;
        }
        catch (err) {
            logger_config_1.default.error(err);
            // TODO: check errors!!
            // return { error: 'ServerError, please try again', status: 500 }
        }
    }
    async authenticateUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
                return { error: 'Invalid email or password', status: 401 };
            }
            else {
                return { user: user };
            }
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
    async registerUser(userData) {
        try {
            const isDuplicateEmail = await super.checkIsDuplicate('email', userData.email);
            const isDuplicateUsername = await super.checkIsDuplicate('username', userData.username);
            if (isDuplicateEmail) {
                return { error: 'Email already exists', status: 409 };
            }
            else if (isDuplicateUsername) {
                return { error: 'Username already exists', status: 409 };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(userData.password, saltRounds);
            const newUser = {
                ...userData,
                password: hashedPassword,
                status: constants_1.UserStatus.ONLINE
            };
            const savedUser = await super.save(newUser);
            if (!savedUser) {
                throw new Error('Error saving the registered user');
            }
            return { user: savedUser };
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
    async handleContactRequest(userId, contactId, action) {
        try {
            const user = await super.getById(userId);
            const contact = await super.getById(contactId);
            const deleteContactRequests = () => {
                user.contactRequests.received = user.contactRequests.received.filter((id) => id != contactId);
                contact.contactRequests.sent = contact.contactRequests.sent.filter((id) => id != userId);
            };
            const checkContactRequestValidity = () => {
                if (user.contacts.filter(contact => contact._id == contactId).length > 0
                    || user.contactRequests.sent.includes(contactId)
                    || user.contactRequests.received.includes(contactId)) {
                    return false;
                }
                else {
                    return true;
                }
            };
            switch (action) {
                case constants_1.ContactRequestActions.SEND:
                    if (checkContactRequestValidity()) {
                        user.contactRequests.sent.push(contactId);
                    }
                    else {
                        return null;
                    }
                    break;
                case constants_1.ContactRequestActions.RECEIVE:
                    user.contactRequests.received.push(contactId);
                    break;
                case constants_1.ContactRequestActions.ACCEPT:
                    user.contacts.push({ _id: contactId });
                    contact.contacts.push({ _id: userId });
                    deleteContactRequests();
                    break;
                case constants_1.ContactRequestActions.REJECT:
                    deleteContactRequests();
                    break;
                default:
                    break;
            }
            await super.update(contact, contactId);
            return await super.update(user, userId);
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
    async populateContactRequests(user) {
        const contactRequestPromises = user.contactRequests.received.map(async (id) => {
            const contact = await super.getById(id);
            return {
                username: contact.username,
                email: contact.email,
                id: contact._id,
            };
        });
        const populatedContactRequests = await Promise.all(contactRequestPromises);
        return populatedContactRequests;
    }
    async populateContacts(user) {
        const contactPromises = user.contacts.map(async (contact) => {
            const searchedContact = await super.getById(contact._id);
            return {
                username: searchedContact.username,
                email: searchedContact.email,
                id: contact._id,
                chatId: contact.chatId,
                status: searchedContact.status
            };
        });
        const populatedContacts = await Promise.all(contactPromises);
        return populatedContacts;
    }
    async populateUser(user) {
        const populatedUserContacts = await this.populateContacts(user);
        const populatedUserContactRequests = await this.populateContactRequests(user);
        return {
            ...user,
            contacts: populatedUserContacts,
            contactRequests: {
                sent: user.contactRequests.sent,
                received: populatedUserContactRequests
            }
        };
    }
    async setupUserForClient(user) {
        //populate user
        const populatedUser = await this.populateUser(user);
        //remove password
        const { password, _id, ...rest } = populatedUser;
        // change ID denomination
        const userForClient = {
            id: _id,
            ...rest
        };
        return userForClient;
    }
    async addChatId(userId, contactId, chatId) {
        try {
            const user = await super.getById(userId);
            const contact = await super.getById(contactId);
            const modifiedUser = {
                ...user,
                contacts: user.contacts.map(contact => contact._id.toString() === contactId ? { ...contact, chatId } : contact)
            };
            const modifiedContact = {
                ...contact,
                contacts: contact.contacts.map(contact => contact._id.toString() === userId ? { ...contact, chatId } : contact)
            };
            await super.update(modifiedContact, contactId);
            return await super.update(modifiedUser, userId);
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
    async updateUser(id, field, value) {
        try {
            const user = await super.getById(id);
            if (field === 'password') {
                const saltRounds = 10;
                const hashedPassword = await bcrypt_1.default.hash(value, saltRounds);
                user[field] = hashedPassword;
            }
            else {
                user[field] = value;
            }
            return await super.update(user, id);
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
    async findContactMatches(userId, query) {
        try {
            const user = await super.getById(userId);
            const populatedUserContacts = await this.populateContacts(user);
            const matches = populatedUserContacts.filter(contact => contact.username.includes(query) || contact.email.includes(query));
            return matches;
        }
        catch (err) {
            logger_config_1.default.error(err);
            return { error: 'ServerError, please try again', status: 500 };
        }
    }
}
exports.usersApi = new UsersApi();
//# sourceMappingURL=users.api.js.map