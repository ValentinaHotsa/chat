import http from "node:http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  // посилаємо повідомлення собі. Перший аргумент назва еміта, події, може бути довільна
  socket.emit("chatMessage", "Welcome to chat!");
  // посилаємо повідомлення всім іншим. broadcast охоплює всіх інших користувачів, не треба робити перевірку по сокету
  socket.broadcast.emit("chatMessage", "New user connected to chat");
  socket.on("chatMessage", (message) => {
    const data = JSON.parse(message);

    socket.emit("chatMessage", `You: ${data.message}`);
    socket.broadcast.emit("chatMessage", `${data.name}: ${data.message}`);
  });
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
