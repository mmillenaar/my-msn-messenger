import { Server } from 'socket.io';
import logger from '../config/logger.config';
import setupSocketListeners from '../routes/sockets/listeners.ws';

export const handleSocketConnection = (io: Server) => {
    io.on('connection', async socket => {
        try {
            logger.info(`New client ${socket.id} connected`);
            setupSocketListeners(socket)
        }
        catch(err) {
            logger.info(err);
        }
    })
};