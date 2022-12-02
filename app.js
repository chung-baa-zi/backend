const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const MainEvent = require("./classes/mainEvent");
const room = require("./router/roomRouter");
const game = require("./router/gameRouter");

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
  room.create(socket, mainEvent);

  //유저가 방에서 퇴장했을 때
  room.exit(io, socket, mainEvent);
  room.disconnect(io, socket, mainEvent);

  // 게임 시작
  game.gameStart(io, socket, mainEvent);

  // 터치게임 1번
  game.touchGame(io, socket, mainEvent);

  // 폭탄게임 2번
  game.bombGame(io, socket, mainEvent);

  // 밸런스게임 3번
  game.options(io, socket, mainEvent);
  game.balanceGame(io, socket, mainEvent);
});
