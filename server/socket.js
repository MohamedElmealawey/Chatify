const { Server } = require("socket.io");

// userId -> socket.id (kept in its own module so controllers can import it
// without creating a circular dependency with server.js)
const userSocketMap = {};
let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      // only remove the entry if it still belongs to THIS socket
      // (a page refresh connects the new socket before the old one disconnects)
      if (userId && userSocketMap[userId] === socket.id) delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO, userSocketMap };
