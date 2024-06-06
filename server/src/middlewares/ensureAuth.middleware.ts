import { NextFunction, Request, Response } from "express";

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).send({
            isAuthenticated: false,
            message: 'Please login',
            sessionExpiration: null
        })
    }
}

export default ensureAuthenticated;