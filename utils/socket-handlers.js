const defaultSettings = {
  botName: "System Bot",
};

const queue = [];
let roomsIndex = 0;
let users = [];

const onUserJoin = (socket, io) => {
  if (queue.length === 0) return queue.push(socket);

  const secondUser = queue[0];

  socket.join(roomsIndex);
  secondUser.join(roomsIndex);
  queue.pop();
  onMessage(
    defaultSettings.botName,
    "Rozmówca dołączył do rozmowy",
    socket,
    true,
    roomsIndex
  );
  users.push({ id: socket.id, roomID: roomsIndex });
  users.push({
    id: secondUser.id,
    roomID: roomsIndex,
  });

  io.to(roomsIndex).emit("openChat");

  roomsIndex++;
};
const onMessage = (
  username,
  message,
  socket,
  ignore = false,
  givenRoomID = undefined
) => {
  const user = users.find((x) => x.id === socket.id);
  if (!ignore && !user) return;

  const roomID = !user ? givenRoomID : user.roomID;

  socket.broadcast.to(roomID).emit("message", {
    username: username === defaultSettings.botName ? username : "Rozmówca",
    message,
  });

  socket.emit("message", {
    username: username === defaultSettings.botName ? username : "Ty",
    message,
  });
};

const onUserLeave = (socket) => {
  if (queue.find((x) => x.id === socket.id)) {
    queue.pop();
    return;
  }
  const user = users.find((x) => x.id === socket.id);

  if (!user) return;

  const roomID = user.roomID;

  const secondUser = users.find(
    (x) => x.roomID === roomID && x.id !== socket.id
  );

  if (!secondUser) return;

  users = users.filter((x) => x.roomID !== roomID);

  socket.broadcast.to(roomID).emit("message", {
    username: defaultSettings.botName,
    message: "Rozmówca opuścił czat",
  });

  socket.broadcast.to(roomID).emit("blockWriting");
};

module.exports = {
  onMessage,
  onUserJoin,
  onUserLeave,
};
