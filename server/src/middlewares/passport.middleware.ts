import { Request } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { usersApi } from '../services/users.api'
import logger from '../config/logger.config'
import { UserType } from '../utils/types'


passport.use('login', new Strategy(
    { usernameField: 'email' },
    async (username: string, password: string, done) => { // TODO: what is 'done' type?
        try {
            const result = await usersApi.authenticateUser(username, password)

            if (result.error) {
                return done(null, false, { message: result.error, status: result.status  })
            }

            done(null, result.user)
        }
        catch (err) {
            logger.error(err)
            done(null, false, err)
        }
    }
))
passport.use('register', new Strategy(
    {
        passReqToCallback: true,
        usernameField: 'email',
    },
    async (req: Request, username: string, password: string, done) => {
        try {
            const newUser = req.body
            const result = await usersApi.registerUser(newUser)

            if (result.error) {
                return done(null, false, { message: result.error, status: result.status })
            }

            done(null, result.user)
        }
        catch (err) {
            logger.error(err)
            done(null, false, err)
        }
    }
))

passport.serializeUser((user: UserType, done) => {
    console.log('Serializing user with id:', user._id)
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done) => {
    console.log('Deserializing user with id:', id)
    try {
        const user = await usersApi.getById(id)
        if (user) {
            console.log('User found')
            done(null, user)
        } else {
            console.log('User not found')
            done(null, false)
        }
    } catch (err) {
        console.error('Error during deserialization:', err)
        done(err)
    }
})

export const passportMiddleware = passport.initialize()
export const passportSessionHandler = passport.session()