"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContacts = exports.updateUsername = exports.rejectContactRequest = exports.acceptContactRequest = exports.sendContactRequest = exports.getLogout = exports.checkUserAuth = exports.postRegister = exports.postLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
const users_api_1 = require("../services/users.api");
const sockets_controller_1 = require("./sockets.controller");
const constants_1 = require("../utils/constants");
const handleAuthentication = (strategy, req, res, next) => {
    passport_1.default.authenticate(strategy, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info?.message });
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            sendAuthResponse(req, res);
        });
    })(req, res, next);
};
const sendAuthResponse = async (req, res) => {
    console.log('req session: ', req.session);
    if (req.isAuthenticated()) {
        try {
            const user = await users_api_1.usersApi.getById(req.user._id);
            const userForClient = await users_api_1.usersApi.setupUserForClient(user);
            return res.status(200).send({
                isAuthenticated: true,
                user: userForClient,
                sessionExpiration: req.session.cookie.maxAge
            });
        }
        catch (error) {
            return res.status(500).send({
                isAuthenticated: false,
                message: 'Internal server error',
                sessionExpiration: null
            });
        }
    }
    else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login',
            sessionExpiration: null
        });
    }
};
const postLogin = (req, res, next) => {
    handleAuthentication('login', req, res, next);
};
exports.postLogin = postLogin;
const postRegister = (req, res, next) => {
    handleAuthentication('register', req, res, next);
};
exports.postRegister = postRegister;
const checkUserAuth = (req, res) => {
    sendAuthResponse(req, res);
};
exports.checkUserAuth = checkUserAuth;
const getLogout = (req, res) => {
    req.logout(err => {
        if (err) {
            logger_config_1.default.error(err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        else {
            return res.status(200).send({ message: 'Logged out successfully' });
        }
    });
};
exports.getLogout = getLogout;
const sendContactRequest = async (req, res) => {
    const userId = req.user._id;
    const { contactEmail } = req.body;
    if (!contactEmail) {
        const response = {
            success: false,
            message: 'Missing required field',
        };
        return res.status(400).json(response);
    }
    const contact = await users_api_1.usersApi.getElementByValue('email', contactEmail);
    if (!contact) {
        const response = {
            success: false,
            message: 'User not found',
            errorType: constants_1.ContactErrorType.NOT_FOUND
        };
        return res.status(404).json(response);
    }
    const updatedSender = await users_api_1.usersApi.handleContactRequest(userId, contact._id, constants_1.ContactRequestActions.SEND);
    if (!updatedSender) {
        const response = {
            success: false,
            message: 'Already a contact/ contact request already sent',
            errorType: constants_1.ContactErrorType.ALREADY_EXISTS
        };
        return res.status(409).json(response);
    }
    const updatedReceiver = await users_api_1.usersApi.handleContactRequest(contact._id, userId, constants_1.ContactRequestActions.RECEIVE);
    if (!updatedSender || !updatedReceiver) {
        const response = {
            success: false,
            message: 'Error sending contact request',
            errorType: constants_1.ContactErrorType.OTHER_ERROR
        };
        return res.status(500).json(response);
    }
    const updatedSenderForClient = await users_api_1.usersApi.setupUserForClient(updatedSender);
    const updatedReceiverForClient = await users_api_1.usersApi.setupUserForClient(updatedReceiver);
    // Send contact request notification to receiver if online
    const receiverSocket = sockets_controller_1.userSockets.get(contact._id.toString());
    if (receiverSocket) {
        receiverSocket.emit('incoming-contact-request', updatedReceiverForClient);
    }
    const response = {
        success: true,
        message: 'Contact request sent',
        user: updatedSenderForClient
    };
    res.status(200).json(response);
};
exports.sendContactRequest = sendContactRequest;
const acceptContactRequest = async (req, res) => {
    const userId = req.user._id;
    const { contactEmail } = req.body;
    if (!contactEmail) {
        return res.status(400).json({ message: 'Missing required field' });
    }
    const contact = await users_api_1.usersApi.getElementByValue('email', contactEmail);
    const updatedUser = await users_api_1.usersApi.handleContactRequest(userId, contact._id, constants_1.ContactRequestActions.ACCEPT);
    // Send new contact notification to sender if online
    const senderSocket = sockets_controller_1.userSockets.get(contact._id);
    const updatedSender = await users_api_1.usersApi.getById(contact._id);
    const updatedSenderForClient = await users_api_1.usersApi.setupUserForClient(updatedSender);
    if (senderSocket) {
        senderSocket.emit('accepted-contact-request', updatedSenderForClient);
    }
    if (!updatedUser || !updatedSender) {
        return res.status(500).json({ message: 'Error sending contact request' });
    }
    const updatedUserForClient = await users_api_1.usersApi.setupUserForClient(updatedUser);
    res.status(200).json({ message: 'Contact request accepted', user: updatedUserForClient });
};
exports.acceptContactRequest = acceptContactRequest;
const rejectContactRequest = async (req, res) => {
    const userId = req.user._id;
    const { contactEmail } = req.body;
    if (!contactEmail) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const contact = await users_api_1.usersApi.getElementByValue('email', contactEmail);
    const updatedUser = await users_api_1.usersApi.handleContactRequest(userId, contact._id, constants_1.ContactRequestActions.REJECT);
    if (!updatedUser) {
        return res.status(500).json({ message: 'Error sending contact request' });
    }
    const updatedUserForClient = await users_api_1.usersApi.setupUserForClient(updatedUser);
    res.status(200).json({ message: 'Contact request rejected', user: updatedUserForClient });
};
exports.rejectContactRequest = rejectContactRequest;
const updateUsername = async (req, res) => {
    const userId = req.user._id;
    const { newUsername } = req.body;
    if (!newUsername) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const updatedUser = await users_api_1.usersApi.updateUser(userId, constants_1.UserUpdateFields.USERNAME, newUsername);
    if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating username' });
    }
    const updatedUserForClient = await users_api_1.usersApi.setupUserForClient(updatedUser);
    res.status(200).json({ message: 'Username updated', user: updatedUserForClient });
};
exports.updateUsername = updateUsername;
const searchContacts = async (req, res) => {
    const userId = req.user._id;
    const { searchTerm } = req.body;
    const matches = await users_api_1.usersApi.findContactMatches(userId, searchTerm);
    return res.status(200).json(matches);
};
exports.searchContacts = searchContacts;
//# sourceMappingURL=users.controller.js.map