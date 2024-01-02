import { NextFunction, Request, Response } from "express";


const ensureAuthenticated = (req: any, res: Response, next: NextFunction) => { // TODO: change 'any' type for Request
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({ message: 'Please login' });
    }
}

export default ensureAuthenticated;