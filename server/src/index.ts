import express, { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import logger from "./config/logger.config";
import { handleSocketConnection } from "./utils/socketHandler";
import { passportMiddleware, passportSessionHandler } from "./middlewares/passport.middleware";
import userRouter from "./routes/users/user.route";

const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}))
app.use(passportMiddleware)
app.use(passportSessionHandler)

const httpServer = new HttpServer(app)
const io = new Socket(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
handleSocketConnection(io)

app.use('/user', userRouter)

const PORT: string | number = process.env.PORT || 3030
const server = httpServer.listen(PORT, () => {
    logger.info(`Server listening at port: ${PORT}`);
})
server.on("error", error  => logger.error(`Error in server: ${error}`))