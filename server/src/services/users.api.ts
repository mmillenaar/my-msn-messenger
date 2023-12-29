import bcrypt from 'bcrypt'
import logger from '../config/logger.config';
import userSchema from "../models/users.schema";
import MongoDbContainer from "../persistence/mongoDb.container";

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
}

export const usersApi = new UsersApi()