import { NextFunction, Request, Response } from "express";

//FIXME: is this being used??

const ensureAuthenticated = (req: any, res: Response, next: NextFunction) => { // TODO: change 'any' type for Request
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({ message: 'Please login' });
    }
}

export default ensureAuthenticated;