import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import socketMessagesConfiguration from "./routes/sockets/messages.ws";

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const httpServer = new HttpServer(app)
const io = new Socket(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', async socket => {
    try {
        console.log(`New client ${socket.id} connected`);
        socketMessagesConfiguration(socket, io.sockets)
    }
    catch(err) {
        console.log(err);
    }

    socket.on('disconnect', () => console.log(`Client ${socket.id} disconnected`))
})

const PORT: string | number = process.env.PORT || 3030
const server = httpServer.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})
server.on("error", error  => console.error(`Error in server: ${error}`))