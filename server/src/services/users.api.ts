import bcrypt from 'bcrypt'
import logger from '../config/logger.config';
import userSchema from "../models/users.schema";
import MongoDbContainer from "../persistence/mongoDb.container";

class UsersApi extends MongoDbContainer {
    constructor() {
        super('users', userSchema)
    }

    async getUserByEmail(email: string) {
        const user = await super.getElementByValue('email', email)
        return user
    }
    async authenticateUser(email: string, password: string) {
        try {
            const user = await this.getUserByEmail(email)
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return { error: 'Invalid email or password' }
            }
            return { user: user }
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError' }
        }
    }
    async registerUser(userData: any) { // TODO: sepecify USERDATA TYPE
        try {
            const isDuplicateEmail = await super.checkIsDuplicate('email', userData.email)
            const isDuplicateUsername = await super.checkIsDuplicate('username', userData.username)

            if (isDuplicateEmail) {
                return { error: 'Email already exists' }
            } else if (isDuplicateUsername) {
                return { error: 'Username already exists' }
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
            const newUser = {
                ...userData,
                password: hashedPassword
            }
            const savedUser = await super.save(newUser)

            return { user: savedUser }
        }
        catch (err) {
            logger.error(err)

            return { error: 'ServerError' }
        }
    }
}

export const usersApi = new UsersApi()