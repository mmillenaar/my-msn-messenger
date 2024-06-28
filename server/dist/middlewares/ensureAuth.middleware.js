"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const ensureAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const userToken = (0, jwt_1.verifyToken)(token);
            req.user = { _id: userToken._id };
            next();
        }
        catch (error) {
            return res.status(403).send({
                isAuthenticated: false,
                message: 'Invalid token'
            });
        }
    }
    else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login'
        });
    }
};
exports.default = ensureAuthenticated;
//# sourceMappingURL=ensureAuth.middleware.js.map