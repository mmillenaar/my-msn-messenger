import { Server } from 'socket.io';
import logger from '../config/logger.config';
import handleSocketChat from '../routes/sockets/chats.ws';

export const handleSocketConnection = (io: Server) => {
    io.on('connection', async socket => {
        try {
            logger.info(`New client ${socket.id} connected`);
            handleSocketChat(socket)
        }
        catch(err) {
            logger.info(err);
        }
    })
};