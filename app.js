const MainEvent = require("./classes/mainEvent");
const User = require("./classes/User");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const room = require("./router/roomRouter");

let mainEvent = new MainEvent();

const port = 3000;
server.listen(port, () => {
  console.log("listening on *: " + port);
});

//소켓 연결이 들어왔을 때
io.on("connection", function (socket) {
  console.log("연결");
  //방장이 아닌 유저가 참여했을 때
  room.join(io, socket, mainEvent);

  //방장이 방을 생성했을 때
  room.create(io, socket, mainEvent);

  //유저가 방에서 퇴장했을 때
  room.disconnect(io, socket, mainEvent);
});
