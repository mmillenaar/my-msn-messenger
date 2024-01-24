import { Request, Response } from 'express'
import passport from 'passport'
import logger from '../config/logger.config'
import { usersApi } from '../services/users.api'
import userSockets from './sockets.controller'
import { ContactRequestActions } from '../utils/constants'


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

export const sendContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact = await usersApi.getElementByValue('email', contactEmail)
    const updatedSender = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.SEND)
    const updatedReceiver = await usersApi.handleContactRequest(contact._id, userId, ContactRequestActions.RECEIVE)

    // Send contact request notification to receiver if online
    const receiverSocket = userSockets.get(contact._id)

    if (receiverSocket) {
        receiverSocket.emit('incoming-contact-request', updatedReceiver)
    }

    if (!updatedSender || !updatedReceiver) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }
    res.status(200).json({ message: 'Contact request sent', user: updatedSender })
}

export const acceptContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact = await usersApi.getElementByValue('email', contactEmail)
    const updatedUser = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.ACCEPT)

    // Send new contact notification to sender if online
    const senderSocket = userSockets.get(contact._id)
    const updatedSender = await usersApi.getById(contact._id)

    if (senderSocket) {
        senderSocket.emit('accepted-contact-request', updatedSender)
    }

    if (!updatedUser || !updatedSender) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }

    res.status(200).json({ message: 'Contact request accepted', user: updatedUser})
}

export const rejectContactRequest = async (req, res) => {
    const { userId, contactEmail } = req.body
    if (!userId || !contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const contact = await usersApi.getElementByValue('email', contactEmail)
    const updatedUser = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.REJECT)

    if (!updatedUser) {
        return res.status(500).json({ message: 'Error sending contact request' })
    }

    res.status(200).json({ message: 'Contact request rejected', user: updatedUser })
}