import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
    user?: { _id: string };
}

const ensureAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        try {
            const userToken = verifyToken(token)
            req.user = { _id: userToken._id }
            next()
        } catch (error) {
            return res.status(403).send({
                isAuthenticated: false,
                message: 'Invalid token'
            })
        }
    } else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login'
        })
    }
}

export default ensureAuthenticated;