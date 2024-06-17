"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportSessionHandler = exports.passportMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const users_api_1 = require("../services/users.api");
const logger_config_1 = __importDefault(require("../config/logger.config"));
passport_1.default.use('login', new passport_local_1.Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const result = await users_api_1.usersApi.authenticateUser(username, password);
        if (result.error) {
            return done(null, false, { message: result.error, status: result.status });
        }
        done(null, result.user);
    }
    catch (err) {
        logger_config_1.default.error(err);
        done(null, false, err);
    }
}));
passport_1.default.use('register', new passport_local_1.Strategy({
    passReqToCallback: true,
    usernameField: 'email',
}, async (req, username, password, done) => {
    try {
        const newUser = req.body;
        const result = await users_api_1.usersApi.registerUser(newUser);
        if (result.error) {
            return done(null, false, { message: result.error, status: result.status });
        }
        done(null, result.user);
    }
    catch (err) {
        logger_config_1.default.error(err);
        done(null, false, err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await users_api_1.usersApi.getById(id);
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
    catch (err) {
        console.error('Error during deserialization:', err);
        done(err);
    }
});
exports.passportMiddleware = passport_1.default.initialize();
exports.passportSessionHandler = passport_1.default.session();
//# sourceMappingURL=passport.middleware.js.map