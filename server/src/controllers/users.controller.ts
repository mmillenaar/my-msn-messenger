import { Request, Response } from 'express'
import passport from 'passport'
import logger from '../config/logger.config'
import { usersApi } from '../services/users.api'
import { userSockets } from './sockets.controller'
import { ContactRequestActions } from '../utils/constants'
import { UserType } from '../utils/types'


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
            return res.status(200).send({ message: 'Logged out successfully' })
        }
    });
}

export const checkUserAuth = async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        const user: UserType = await usersApi.getById(req.user._id)
        const userForClient = await usersApi.setupUserForClient(user)

        return res.status(200).send({ isAuthenticated: true, user: userForClient})
    }
    else {
        return res.status(401).send({ isAuthenticated: false, message: 'Please login' })
    }
}

export const sendContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact: UserType = await usersApi.getElementByValue('email', contactEmail)
    const updatedSender = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.SEND)
    const updatedReceiver = await usersApi.handleContactRequest(contact._id, userId, ContactRequestActions.RECEIVE)
    const updatedSenderForClient = await usersApi.setupUserForClient(updatedSender)
    const updatedReceiverForClient = await usersApi.setupUserForClient(updatedReceiver)

    // Send contact request notification to receiver if online
    const receiverSocket = userSockets.get(contact._id.toString())

    if (receiverSocket) {
        receiverSocket.emit('incoming-contact-request', updatedReceiverForClient)
    }
    if (updatedSender.error) {
        return res.status(409).json({ message: updatedSender.error })
    }
    if (!updatedSender || !updatedReceiver) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }

    res.status(200).json({ message: 'Contact request sent', user: updatedSenderForClient })
}

export const acceptContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact: UserType = await usersApi.getElementByValue('email', contactEmail)
    const updatedUser: UserType = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.ACCEPT)

    // Send new contact notification to sender if online
    const senderSocket = userSockets.get(contact._id)
    const updatedSender = await usersApi.getById(contact._id)
    const updatedSenderForClient = await usersApi.setupUserForClient(updatedSender)

    if (senderSocket) {
        senderSocket.emit('accepted-contact-request', updatedSenderForClient)
    }
    if (!updatedUser || !updatedSender) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }

    const updatedUserForClient = usersApi.setupUserForClient(updatedUser)

    res.status(200).json({ message: 'Contact request accepted', user: updatedUserForClient })
}

export const rejectContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact: UserType = await usersApi.getElementByValue('email', contactEmail)
    const updatedUser: UserType = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.REJECT)

    if (!updatedUser) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }

    const updatedUserForClient = await usersApi.setupUserForClient(updatedUser)

    res.status(200).json({ message: 'Contact request rejected', user: updatedUserForClient })
}