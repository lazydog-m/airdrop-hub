const { Server } = require('socket.io');
const RestApiException = require('../exceptions/RestApiException');

let socketIo = null;

function initSocket(server) {
  if (!socketIo) {
    socketIo = new Server(server, {
      cors: {
        origin: 'http://localhost:5173', // or * for all 
        methods: ['GET', 'POST'],
        // credentials: true,
      },
    });

    socketIo.on('connection', (socket) => {
      console.log('⚡️ Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('💨 Client disconnected:', socket.id);
      });
    });
  }

  return socketIo;
}

function getSocket() {
  if (!socketIo) {
    throw new RestApiException('Socket.IO chưa được khởi tạo');
  }
  return socketIo;
}

module.exports = {
  initSocket,
  getSocket,
};

