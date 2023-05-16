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
            if (!bcrypt.compareSync(password, user.password)) {
                throw new Error(`Authentication error: incorrect password`)
            }
            return user
        }
        catch (err) {
            logger.error(err)
            throw err // TODO: program needs to NOT STOP
        }
    }
    async registerUser(userData: any) { // TODO: sepecify USERDATA TYPE
        try {
            const isDuplicate = await super.checkIsDuplicate('email', userData.email)
            if (!isDuplicate) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
                const newUser = {
                    ...userData,
                    password: hashedPassword
                }
                const savedUser = await super.save(newUser)
                return savedUser
            }
            else {
                throw new Error(`User with email: ${userData.email} already exists`)
            }
        }
        catch (err) {
            logger.error(err)
            throw err
        }
    }
}

export const usersApi = new UsersApi()