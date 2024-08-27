import { Request, Response } from 'express'
import logger from '../config/logger.config'
import { usersApi } from '../services/users.api'
import { userSockets } from './sockets.controller'
import { ContactErrorType, ContactRequestActions, UserBlockActions, UserUpdateFields } from '../utils/constants'
import { ContactResponseType, UserAuthResult, UserType } from '../utils/types'
import { generateToken, verifyToken } from '../utils/jwt'

interface AuthenticatedRequest extends Request {
    user?: { _id: string };
}

const handleUserAuthentication = async (strategy: string, req: AuthenticatedRequest, res: Response) => {
    try {
        let result: UserAuthResult
        if (strategy === 'login') {
            result = await usersApi.authenticateUser(req.body.email, req.body.password)
        } else if (strategy === 'register') {
            result = await usersApi.registerUser(req.body)
        }

        if (result.error) {
            return res.status(result.status).send({ message: result.error })
        } else {
            const token = generateToken(result.user._id)
            req.user = { _id: result.user._id }

            return await sendAuthResponse(req, res, token)
        }
    } catch (error) {
        logger.error(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
};

const sendAuthResponse = async (req: AuthenticatedRequest, res: Response, token: string) => {
    try {
        const user: UserType = await usersApi.getById(req.user!._id)
        const userForClient = await usersApi.setupUserForClient(user)
        return res.status(200).send({
            isAuthenticated: true,
            user: userForClient,
            token: token
        })
    } catch (error) {
        logger.error(error)

        return res.status(500).send({
            isAuthenticated: false,
            message: 'Internal server error'
        })
    }
}

export const postLogin = (req: Request, res: Response) => {
    handleUserAuthentication('login', req as AuthenticatedRequest, res)
}

export const postRegister = (req: Request, res: Response) => {
    handleUserAuthentication('register', req as AuthenticatedRequest, res)
}

export const checkUserAuth = (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]

        try {
            const userToken = verifyToken(token)
            if (userToken) {
                req.user = { _id: userToken._id }

                return sendAuthResponse(req, res, token)
            } else {
                throw new Error('Invalid token')
            }
        }
        catch (error) {
            logger.error(error)
            return res.status(401).send({
                isAuthenticated: false,
                message: 'Invalid token'
            })
        }
    }
    else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login'
        })
    }
}

export const getLogout = (req, res) => {
    // No server-side action needed for JWT logout
    return res.status(200).send({ message: 'Logged out successfully' });
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

export const handleUserBlockage = async (req, res, action: UserBlockActions) => {
    const userId = req.user._id
    const { contactId } = req.body

    const shouldBlock = action === 'block'

    const updatedUser = await usersApi.setUserBlockageStatus(userId, contactId, shouldBlock)
    if (!updatedUser) {
        const errorMessage = shouldBlock ? 'Error blocking user' : 'Error unblocking user'
        return res.status(500).json({ message: errorMessage })
    }
    const updatedUserForClient = await usersApi.setupUserForClient(updatedUser)

    const updatedContact = await usersApi.getById(contactId)
    const updatedContactForClient = await usersApi.setupUserForClient(updatedContact)
    const contactSocket = userSockets.get(contactId)
    if (contactSocket) {
        contactSocket.emit('new-blocked-status', updatedContactForClient)
    }

    const successMessage = shouldBlock ? 'User blocked successfully' : 'User unblocked successfully'

    return res.status(200).json({ message: successMessage, user: updatedUserForClient })
}