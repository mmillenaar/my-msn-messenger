import { Server } from 'socket.io';
import logger from '../config/logger.config';
import handleSocketChat from '../routes/sockets/messages.ws';

export const handleSocketConnection = (io: Server) => {
    io.on('connection', async socket => {
        try {
            logger.info(`New client ${socket.id} connected`);
            handleSocketChat(socket, io.sockets)
        }
        catch(err) {
            logger.info(err);
        }

        socket.on('disconnect', () => logger.info(`Client ${socket.id} disconnected`))
    })
};