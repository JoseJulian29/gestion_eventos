// socket.js
const socketIo = require('socket.io');

let io; // Instancia de Socket.IO

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized!');
    }
    return io;
};

module.exports = {
    initSocket,
    getIo
};
