import onlineIcon from '../assets/icons/avatar-online.png'
import offlineIcon from '../assets/icons/avatar-offline.png'
import busyIcon from '../assets/icons/avatar-busy.png'
import outIcon from '../assets/icons/avatar-out.png'
import msnIcon from '../assets/icons/MSN-messenger-icon.webp'
import { TabType } from './types'

export const formUsernameGroup = {
    groupName: "username",
    inputType: "text",
    label: "Username"
}
export const formEmailGroup = {
    groupName: "email",
    inputType: "email",
    label: "E-mail address:"
}
export const formPasswordGroup = {
    groupName: "password",
    inputType: "password",
    label: "Password:"
}
export const formConfirmPasswordGroup = {
    groupName: "confirmPassword",
    inputType: "password",
    label: "Confirm Password"
}

export enum ContactRequestActions {
    SEND = 'send',
    ACCEPT = 'accept',
    REJECT = 'reject'
}

export const loginText = 'Please sign in with your .NET Passport to see your online contacts, have online conversations, and receive alerts:'
export const registerText = 'Please create a .NET Passport to see your online contacts, have online conversations, and receive alerts:'
export const chatBoxText = 'Never give out your password or credit card number in an instant message conversation.'
export const offlineContactText = "This user is offline. They will not be notified about your new messages."

export const userStatusItems = [
    {
        id: 'Online',
        text: 'Online',
        icon: onlineIcon,
        priority: 1,
    },
    {
        id: 'Offline',
        text: 'Offline',
        icon: offlineIcon,
        priority: 7,
    },
    {
        id: 'Busy',
        text: 'Busy',
        icon: busyIcon,
        priority: 6,
    },
    {
        id: 'Away',
        text: 'Away',
        icon: outIcon,
        priority: 3,
    },
    {
        id: 'Be Right Back',
        text: 'Be Right Back',
        icon: outIcon,
        priority: 2,
    },
    {
        id: 'On the Phone',
        text: 'On the Phone',
        icon: busyIcon,
        priority: 4,
    },
    {
        id: 'Out to Lunch',
        text: 'Out to Lunch',
        icon: outIcon,
        priority: 5,
    }
]

export const defaultTab: TabType = {
    id: '/',
    label: 'Windows Messenger',
    path: '/',
    icon: msnIcon
}
export const addContactTab: TabType = {
    id: '/add-contact',
    label: 'Add Contact',
    path: '/add-contact',
    icon: msnIcon
}
export const newConversationTab: TabType = {
    id: '/new-conversation',
    label: 'New Instant Message',
    path: '/new-conversation',
    icon: msnIcon
}

export enum ContactErrorType {
    NOT_FOUND = 'not found',
    ALREADY_EXISTS = 'already exists',
    OTHER_ERROR = 'other error'
}

export const addContactFirstStepSubtitle = "Please type your contact's complete e-mail address"
export const getAddContactSuccessSubtitle = (contactEmail: string) => {
    return `Success! ${contactEmail} wass added to your list!`
}
export const getAddContactErrorSubtitle = (contactEmail: string) => {
    return `Error! ${contactEmail} could not be added to your list`
}
export const addContactSuccessText = 'An invitation was sent. You will have to wait until it is accepted to start chatting! Please proceed to Home page to chat with any other contact.'
export const getAddContactErrorText = (errorCode?: ContactErrorType) => {
    switch (errorCode) {
        case ContactErrorType.ALREADY_EXISTS:
            return 'This contact is already in your contact list or you have already sent them an invitation. Please go back to Home page to start a conversation.'

        case ContactErrorType.NOT_FOUND:
            return 'The contact you are trying to reach does not exist. Please check for spelling mistakes or ask them to join MSN Messenger.'

        default:
            return 'There was a problem sending your invitation. Please try again.'
    }
}
export const addContactEmailExamples = ['name_123@hotmail.com', 'myname@msn.com', 'example@passport.com']

export const newConversationsubtitle = 'Please type the e-mail address or username of the person you want to start a conversation with:'

export const contactRequestViewCheckboxOptions = [
    {
        label: 'Allow this contact to see your status and send you messages',
        id: 'accept-contact-request',
        name: 'accept',
    },
    {
        label: 'Prevent this contact from seeing your status and sending you messages',
        id: 'reject-contact-request',
        name: 'reject',
    }
]