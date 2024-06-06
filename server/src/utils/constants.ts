export enum ContactRequestActions {
    ACCEPT = 'accept',
    RECEIVE = 'receive',
    REJECT = 'reject',
    SEND = 'send'
}

export enum UserUpdateFields {
    USERNAME = 'username',
    PASSWORD = 'password',
    STATUS = 'status'
}

export enum UserStatus {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
    BUSY = 'Busy',
    AWAY = 'Away',
    BE_RIGHT_BACK = 'Be Right Back',
    ON_THE_PHONE = 'On the Phone',
    OUT_TO_LUNCH = 'Out to Lunch'
}

export enum ContactErrorType {
    NOT_FOUND = 'not found',
    ALREADY_EXISTS = 'already exists',
    OTHER_ERROR = 'other error'
}