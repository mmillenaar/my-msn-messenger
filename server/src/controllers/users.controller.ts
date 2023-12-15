import { Request, Response } from 'express'
import passport from 'passport'
import logger from '../config/logger.config'


export const postLogin = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({ message: info?.message })
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr)
            }

            return res.status(200).json({ message: 'Login successful' })
        })
    })(req, res, next)
}

export const postRegister = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({ message: info?.message }) // TODO: explain why
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr)
            }

            return res.status(200).json({ message: 'Registration successful' })
        })
    })(req, res, next)
}

export const getLogout = (req, res) => {
    req.logout(err => {
        if (err) {
            logger.error(err)

            return res.status(500).json({ message: 'Error logging out' })
        }
        else {
            res.status(200).send({ message: 'Logged out successfully' })
        }
    });
}
