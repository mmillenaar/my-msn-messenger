import { Request, Response } from "express"

export const getCheckUserAuth = async (req: any, res: Response) => {
    if (req.isAuthenticated()) {
        const {
            password,
            _id,
            ...rest
        } = req.user

        const userForClient = {
            id: _id,
            ...rest
        }

        return res.status(200).send({ isAuthenticated: true, user: userForClient })
    }
    else {
        return res.status(401).send({ isAuthenticated: false, message: 'Please login' })
    }
}