"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactErrorType = exports.UserStatus = exports.UserUpdateFields = exports.ContactRequestActions = void 0;
var ContactRequestActions;
(function (ContactRequestActions) {
    ContactRequestActions["ACCEPT"] = "accept";
    ContactRequestActions["RECEIVE"] = "receive";
    ContactRequestActions["REJECT"] = "reject";
    ContactRequestActions["SEND"] = "send";
})(ContactRequestActions = exports.ContactRequestActions || (exports.ContactRequestActions = {}));
var UserUpdateFields;
(function (UserUpdateFields) {
    UserUpdateFields["USERNAME"] = "username";
    UserUpdateFields["PASSWORD"] = "password";
    UserUpdateFields["STATUS"] = "status";
})(UserUpdateFields = exports.UserUpdateFields || (exports.UserUpdateFields = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ONLINE"] = "Online";
    UserStatus["OFFLINE"] = "Offline";
    UserStatus["BUSY"] = "Busy";
    UserStatus["AWAY"] = "Away";
    UserStatus["BE_RIGHT_BACK"] = "Be Right Back";
    UserStatus["ON_THE_PHONE"] = "On the Phone";
    UserStatus["OUT_TO_LUNCH"] = "Out to Lunch";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var ContactErrorType;
(function (ContactErrorType) {
    ContactErrorType["NOT_FOUND"] = "not found";
    ContactErrorType["ALREADY_EXISTS"] = "already exists";
    ContactErrorType["OTHER_ERROR"] = "other error";
})(ContactErrorType = exports.ContactErrorType || (exports.ContactErrorType = {}));
//# sourceMappingURL=constants.js.map