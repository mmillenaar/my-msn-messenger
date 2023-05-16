import { NextFunction, Request, Response } from "express";


const ensureAuthenticated = (req: any, res: Response, next: NextFunction) => { // TODO: change 'any' type for Request
    console.log('authenticating')
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('Please login');
    }
}

export default ensureAuthenticated;