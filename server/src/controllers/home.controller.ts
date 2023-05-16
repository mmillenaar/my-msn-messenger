import { Request, Response } from "express"
import { usersApi } from "../services/users.api"

export const getRoot = async (req: any, res: Response) => {
    console.log('holaaaaaa')
    console.log('req: ', req)
    const mainUser = await usersApi.getUserByEmail(req.user.email)
    res.json(mainUser)
}