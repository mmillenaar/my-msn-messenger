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