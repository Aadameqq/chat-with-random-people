const express = require("express");
const http = require(`http`);
const socketio = require("socket.io");
const {
  onMessage,
  onUserJoin,
  onUserLeave,
} = require(`./utils/socket-handlers.js`);

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

app.use(express.static(`${__dirname}/public`));

io.on("connection", (socket) => {
  socket.on("userJoin", () => onUserJoin(socket, io));
  socket.on("chatMessage", (message) => onMessage("none", message, socket));
  socket.on("disconnect", () => onUserLeave(socket));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
