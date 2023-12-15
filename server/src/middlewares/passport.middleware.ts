import passport from 'passport'
import { Strategy } from 'passport-local'
import { usersApi } from '../services/users.api'
import logger from '../config/logger.config'
import { Request } from 'express'
import { User } from '../utils/types'


passport.use('login', new Strategy(
    { usernameField: 'email' },
    async (username: string, password: string, done) => { // TODO: what is 'done' type?
        try {
            const result = await usersApi.authenticateUser(username, password)

            if (result. error) {
                return done(null, false, { message: result.error })
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
                return done(null, false, { message: result.error })
            }

            done(null, result.user)
        }
        catch (err) {
            logger.error(err)
            done(null, false, err)
        }
    }
))

passport.serializeUser((user: User, done) => {
    done(null, user)
})

passport.deserializeUser((user: User, done) => {
    done(null, user)
})

export const passportMiddleware = passport.initialize()
export const passportSessionHandler = passport.session()