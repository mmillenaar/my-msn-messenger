import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import logger from "./config/logger.config";
import { handleSocketConnection } from "./utils/socketHandler";
import { passportMiddleware, passportSessionHandler } from "./middlewares/passport.middleware";
import userRouter from "./routes/users/user.route";
import helmet from "helmet";

dotenv.config()

const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
}))

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000,
        secure: process.env.NODE_ENV === 'production'
    }
}))
app.use(passportMiddleware)
app.use(passportSessionHandler)

const httpServer = new HttpServer(app)
const io = new Socket(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
    }
})
handleSocketConnection(io)

app.use('/user', userRouter)

const PORT: string | number = process.env.PORT || 3030
const server = httpServer.listen(PORT, () => {
    logger.info(`Server listening at port: ${PORT}`);
})
server.on("error", error  => logger.error(`Error in server: ${error}`))