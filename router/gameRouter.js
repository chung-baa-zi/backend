module.exports.gameStart = function (io, socket, mainEvent) {
  socket.on("start", (data) => {
    const gameType = data.gameType;
    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    gameRoom.createGame(gameType);

    const response = {
      state: "gameStart",
      gameType: gameType,
    };

    io.to(gameRoom.roomId).emit("start", response);
  });
};

module.exports.touchGame = function (io, socket, mainEvent) {
  socket.on("touchGame", async (data) => {
    const touchCount = data.touchCount;
    console.log(socket.roomId + ": ", socket.name, touchCount + " touch");

    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    await gameRoom.getGame.startGame();
    gameRoom.getGame.getGResult.getScore.set(socket.name, touchCount);

    if (gameRoom.game.getGResult.getScore.size === gameRoom.getRoomSize) {
      console.log(socket.roomId, "터치 게임 종료");
      gameRoom.game.endGame();

      const response = {
        losers: gameRoom.getGame.getGResult.getLosers,
        penalty: gameRoom.getGame.getGResult.getPenalty,
        score: Object.fromEntries(gameRoom.getGame.getGResult.getScore),
      };

      //1초 멈추고 실행
      console.log("response", response);
      io.to(gameRoom.roomId).emit("result", response);

      gameRoom.deleteGame();
    }
  });
};

module.exports.bombGame = function (io, socket, mainEvent) {
  socket.on("bombGame", async () => {
    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    console.log("isStarted : " + gameRoom.getGame.getIsStarted);
    // 게임 시작
    if (gameRoom.getGame.getIsStarted == false) {
      gameRoom.getGame.setIsStarted = true;
      let users = [];
      await gameRoom.getGame.startGame().then(() => {
        users = gameRoom.getUsers.map((object) => {
          return object.userName;
        });
        gameRoom.getGame.shuffleOrder(users);
        // 섞인 유저리스트 출력
        console.log(gameRoom.getGame.getRandomUsers);
      });
      // index 0 유저 출력
      console.log(
        gameRoom.getGame.getRandomUsers[gameRoom.getGame.getBombOwnerIndex]
      );
      const response = {
        users: gameRoom.getGame.getRandomUsers,
        index: gameRoom.getGame.getBombOwnerIndex,
      };
      io.to(gameRoom.roomId).emit("bombGame", response);
      // 초 시작, 0.1초마다 갱신
      let interval = setInterval(function () {
        gameRoom.getGame.runTimerAlarm();
        // 시간이 다됐다면 벌칙자 보냄
        if (gameRoom.getGame.getTime <= 0) {
          gameRoom.getGame.endGame();
          const response = {
            losers: gameRoom.getGame.getGResult.getLosers,
            penalty: gameRoom.getGame.getGResult.getPenalty,
          };
          io.to(gameRoom.roomId).emit("timeup", response);
          clearInterval(interval);
          gameRoom.deleteGame();
        }
      }, 100);
    }
    // 게임이 진행중이라면
    else if (gameRoom.getGame.getIsStarted == true) {
      gameRoom.getGame.setBombOwnerIndex();
      console.log(
        gameRoom.getGame.getRandomUsers[gameRoom.getGame.getBombOwnerIndex]
      );
      const response = {
        users: gameRoom.getGame.getRandomUsers,
        index: gameRoom.getGame.getBombOwnerIndex,
      };
      io.to(gameRoom.roomId).emit("bombGame", response);
    }
  });
};

//밸런스 게임 전 선택지를 client 측으로 전송
module.exports.options = function (io, socket, mainEvent) {
  socket.on("options", async () => {
    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    await gameRoom.getGame.startGame().then(() => {
      const response = {
        option: gameRoom.getGame.getChoices,
      };

      io.to(gameRoom.roomId).emit("options", response);
    });
  });
};

module.exports.balanceGame = function (io, socket, mainEvent) {
  socket.on("balanceGame", (data) => {
    const option = data.option;
    console.log(socket.roomId + ": ", socket.name, option + " 선택");

    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    gameRoom.getGame.getGResult.getScore.set(socket.name, option);
    if (gameRoom.game.getGResult.getScore.size === gameRoom.getRoomSize) {
      console.log(socket.roomId, "밸런스 게임 종료");
      gameRoom.game.endGame();

      const response = {
        losers: gameRoom.getGame.getGResult.getLosers,
        penalty: gameRoom.getGame.getGResult.getPenalty,
        score: Object.fromEntries(gameRoom.getGame.getGResult.getScore),
      };

      //1초 멈추고 실행
      console.log("response", response);
      io.to(gameRoom.roomId).emit("result", response);

      gameRoom.deleteGame();
    }
  });
};
