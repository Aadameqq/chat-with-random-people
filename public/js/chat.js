const sendForm = document.querySelector(`.send`);
const messages = document.querySelector(`.messages`);
const chat = document.querySelector(`.chat`);
const conInfo = document.querySelector(`.connectionInfo`);
const leaveButton = document.querySelector(`#leave-button`);
const newRoomButton = document.querySelector(`#new-room-button`);
const socket = io();

socket.on("message", ({ username, message }) => {
  messages.innerHTML += `<div class="message">
  <strong>${username}:</strong>
  <p>${message}</p>
</div>`;
  window.scrollTo(0, messages.scrollHeight);
});
socket.emit("userJoin", "Rozmówca dołączył do czatu");

socket.on("openChat", () => {
  chat.style = "";
  messages.style = "";
  conInfo.style = "display:none;";
  leaveButton.style = "";
  newRoomButton.style = "";
});
socket.on("closeChat", () => {
  chat.style = "display:none;";
  messages.style = "display:none;";
  conInfo.style = "";
  messages.innerHTML = "";
  leaveButton.style = "display:none;";
  newRoomButton.style = "display:none;";
});

socket.on("blockWriting", () => {
  chat.style = "display:none;";
  setTimeout(() => {
    location.href = "/";
  }, 6000);
});

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("chatMessage", e.target.elements.message.value);
  document.querySelector(`#message`).value = "";
});

leaveButton.addEventListener("click", () => {
  location.href = "/";
});
newRoomButton.addEventListener("click", () => {
  window.location.reload();
});
