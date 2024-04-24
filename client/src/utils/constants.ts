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

export enum MessageStatus {
    SENT = 'sent',
    RECEIVED = 'received',
    READ = 'read'
}

export enum ContactRequestActions {
    SEND = 'send',
    ACCEPT = 'accept',
    REJECT = 'reject'
}

export const loginText = 'Please sign in with your .NET Passport to see your online contacts, have online conversations, and receive alerts:'
export const registerText = 'Please create a .NET Passport to see your online contacts, have online conversations, and receive alerts:'
export const chatBoxText = 'Never give out your password or credit card number in an instant message conversation.'

export const userStatusItems = [
    {
        name: 'Online',
        icon: onlineIcon,
        priority: 1,
    },
    {
        name: 'Offline',
        icon: offlineIcon,
        priority: 7,
    },
    {
        name: 'Busy',
        icon: busyIcon,
        priority: 6,
    },
    {
        name: 'Away',
        icon: outIcon,
        priority: 3,
    },
    {
        name: 'Be Right Back',
        icon: outIcon,
        priority: 2,
    },
    {
        name: 'On the Phone',
        icon: busyIcon,
        priority: 4,
    },
    {
        name: 'Out to Lunch',
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