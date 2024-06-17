"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login',
            sessionExpiration: null
        });
    }
};
exports.default = ensureAuthenticated;
//# sourceMappingURL=ensureAuth.middleware.js.map