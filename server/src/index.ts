import express from "express";
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import logger from "./config/logger.config";
import { handleSocketConnection } from "./utils/socketHandler";
import userRouter from "./routes/users/user.route";
import helmet from "helmet";

dotenv.config()

const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Trust proxy setup for deployment reverse proxy
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // Trust only first proxy
}

// Cors setup
const allowedOrigins = ['http://localhost:3000']
if (process.env.CLIENT_ORIGIN && !allowedOrigins.includes(process.env.CLIENT_ORIGIN)) {
    allowedOrigins.push(process.env.CLIENT_ORIGIN)
}
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error('origin:', origin, 'not allowed')
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}
app.use(cors(corsOptions))

const httpServer = new HttpServer(app)
const io = new Socket(httpServer, { cors: corsOptions })
handleSocketConnection(io)

app.use('/user', userRouter)

const PORT: number = JSON.parse(process.env.PORT) || 3030
const server = httpServer.listen(PORT, () => {
    logger.info(`Server listening at port: ${PORT}`);
})
server.on("error", error => logger.error(`Error in server: ${error}`))