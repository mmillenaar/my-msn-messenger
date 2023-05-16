import { Request, Response } from "express"

export const getCheckUserAuth = async (req: any, res: Response) => {
    const user = req.isAuthenticated()
    if (user) {
        res.status(200).send({ isAuthenticated: true })
    }
    else {
        res.status(401).send({ isAuthenticated: false })
    }
}