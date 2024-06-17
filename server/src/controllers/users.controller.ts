import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import logger from '../config/logger.config'
import { usersApi } from '../services/users.api'
import { userSockets } from './sockets.controller'
import { ContactErrorType, ContactRequestActions, UserUpdateFields } from '../utils/constants'
import { ContactResponseType, UserType } from '../utils/types'


const handleAuthentication = (strategy: string, req: any, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, {keepSessionInfo: true}, (err, user, info) => {
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
            sendAuthResponse(req, res)
        })
    })(req, res, next)
};

const sendAuthResponse = async (req: any, res: Response) => {
    console.log('sessionId: ', req.sessionID)
    console.log('req session: ', req.session)
    if (req.isAuthenticated()) {
        try {
            const user: UserType = await usersApi.getById(req.user._id)
            const userForClient = await usersApi.setupUserForClient(user)

            return res.status(200).send({
                isAuthenticated: true,
                user: userForClient,
                sessionExpiration: req.session.cookie.maxAge
            })
        } catch (error) {
            return res.status(500).send({
                isAuthenticated: false,
                message: 'Internal server error',
                sessionExpiration: null
            })
        }
    } else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login',
            sessionExpiration: null
        })
    }
}

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
    handleAuthentication('login', req, res, next)
}

export const postRegister = (req: Request, res: Response, next: NextFunction) => {
    handleAuthentication('register', req, res, next)
}

export const checkUserAuth = (req: Request, res: Response) => {
    sendAuthResponse(req, res)
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
    const userId = req.user._id
    const { contactEmail } = req.body

    if (!contactEmail) {
        const response: ContactResponseType = {
            success: false,
            message: 'Missing required field',
        }

        return res.status(400).json(response)
    }

    const contact: UserType = await usersApi.getElementByValue('email', contactEmail)

    if (!contact) {
        const response: ContactResponseType = {
            success: false,
            message: 'User not found',
            errorType: ContactErrorType.NOT_FOUND
        }

        return res.status(404).json(response)
    }
    const updatedSender = await usersApi.handleContactRequest(userId, contact._id, ContactRequestActions.SEND)

    if (!updatedSender) {
        const response: ContactResponseType = {
            success: false,
            message: 'Already a contact/ contact request already sent',
            errorType: ContactErrorType.ALREADY_EXISTS
        }

        return res.status(409).json(response)
    }

    const updatedReceiver = await usersApi.handleContactRequest(contact._id, userId, ContactRequestActions.RECEIVE)

    if (!updatedSender || !updatedReceiver) {
        const response: ContactResponseType = {
            success: false,
            message: 'Error sending contact request',
            errorType: ContactErrorType.OTHER_ERROR
        }

        return res.status(500).json(response)
    }

    const updatedSenderForClient = await usersApi.setupUserForClient(updatedSender)
    const updatedReceiverForClient = await usersApi.setupUserForClient(updatedReceiver)

    // Send contact request notification to receiver if online
    const receiverSocket = userSockets.get(contact._id.toString())

    if (receiverSocket) {
        receiverSocket.emit('incoming-contact-request', updatedReceiverForClient)
    }

    const response: ContactResponseType = {
        success: true,
        message: 'Contact request sent',
        user: updatedSenderForClient
    }

    res.status(200).json(response)
}

export const acceptContactRequest = async (req, res) => {
    const userId = req.user._id
    const { contactEmail } = req.body
    if (!contactEmail) {
        return res.status(400).json({ message: 'Missing required field' })
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

    const updatedUserForClient = await usersApi.setupUserForClient(updatedUser)

    res.status(200).json({ message: 'Contact request accepted', user: updatedUserForClient })
}

export const rejectContactRequest = async (req, res) => {
    const userId = req.user._id
    const { contactEmail } = req.body
    if (!contactEmail) {
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

export const updateUsername = async (req, res) => {
    const userId = req.user._id
    const { newUsername } = req.body
    if (!newUsername) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    const updatedUser: UserType = await usersApi.updateUser(userId, UserUpdateFields.USERNAME, newUsername)

    if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating username' })
    }

    const updatedUserForClient = await usersApi.setupUserForClient(updatedUser)

    res.status(200).json({ message: 'Username updated', user: updatedUserForClient })
}

export const searchContacts = async (req, res) => {
    const userId = req.user._id
    const { searchTerm } = req.body

    const matches = await usersApi.findContactMatches(userId, searchTerm)

    return res.status(200).json(matches)
}