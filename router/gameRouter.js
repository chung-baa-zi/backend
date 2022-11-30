//방장 유저가 서버측으로 게임을 시작한다는 request를 전송
module.exports.gameStart = function (io, socket, mainEvent) {
  socket.on("start", (data) => {
    const gameType = data.gameType; //클라이언트 측으로 게임 타입을 받음(1 -> 터치게임, 2 -> 폭탄 게임, 3 -> 밸런스 게임)
    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    gameRoom.createGame(gameType);

    const response = {
      //클라이언트 측으로 게임 type을 전송
      state: "gameStart",
      gameType: gameType,
    };

    io.to(gameRoom.roomId).emit("start", response);
  });
};
//클라이언트 측으로 터치한 횟수를 받음
module.exports.touchGame = function (io, socket, mainEvent) {
  socket.on("touchGame", async (data) => {
    const touchCount = data.touchCount;
    console.log(socket.roomId + ": ", socket.name, touchCount + " touch");

    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    if (gameRoom.getGame.getGResult.getScore.size == 0)
      //처음 보낸 클라이언트의 response가 도착 시 게임을 시작
      await gameRoom.getGame.startGame();
    gameRoom.getGame.getGResult.getScore.set(socket.name, touchCount); //터치 게임의 횟수와 유저의 name을 map 형태로 저장

    if (gameRoom.getGame.getGResult.getScore.size === gameRoom.getRoomSize) {
      //방의 모든 유저가 touch count를 전송 시 게임을 종료
      console.log(socket.roomId, "터치 게임 종료");
      gameRoom.game.endGame(); //게임 결과 정산

      const response = {
        //클라이언트 측으로 보낼 response를 json 형태로 변환
        losers: gameRoom.getGame.getGResult.getLosers,
        penalty: gameRoom.getGame.getGResult.getPenalty,
        score: Object.fromEntries(gameRoom.getGame.getGResult.getScore),
      };

      console.log("response", response);
      io.to(gameRoom.roomId).emit("result", response);

      gameRoom.deleteGame(); //한번의 게임을 끝나고 다음 게임을 위해 게임 객체를 삭제
    }
  });
};

module.exports.bombGame = function (io, socket, mainEvent) {
  socket.on("bombGame", async () => {
    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    try {
      console.log(gameRoom.getRoomId, gameRoom.getGame.getIsStarted);
    } catch (e) {
      console.log("존재하지 않는 게임방");
      return;
    }

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
        console.log(
          gameRoom.getRoomId,
          "랜덤 유저 리스트: " + gameRoom.getGame.getRandomUsers
        );
      });
      // index 0 유저 출력
      console.log(
        gameRoom.getRoomId,
        "현재 폭탄 주인: " +
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
          io.to(gameRoom.roomId).emit("result", response);
          clearInterval(interval);
          gameRoom.deleteGame();
        }
      }, 100);
    }
    // 게임이 진행중이라면
    else if (gameRoom.getGame.getIsStarted == true) {
      gameRoom.getGame.setBombOwnerIndex();
      console.log(
        gameRoom.getRoomId,
        "현재 폭탄 주인 " +
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
      //DB에서 게임 무작위로 밸런스 게임 선택지를 select한다.
      const response = {
        option: gameRoom.getGame.getChoices,
      };

      io.to(gameRoom.roomId).emit("options", response);
    });
  });
};
//클라이언츠 측으로 선택지 값을 받음
module.exports.balanceGame = function (io, socket, mainEvent) {
  socket.on("balanceGame", (data) => {
    const option = data.option;
    console.log(socket.roomId + ": ", socket.name, option + " 선택");

    const gameRoom = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );

    gameRoom.getGame.getGResult.getScore.set(socket.name, option); //map 형태고 게임 score를 저장 Map('유저이름', '선택지')
    if (gameRoom.game.getGResult.getScore.size === gameRoom.getRoomSize) {
      console.log(socket.roomId, "밸런스 게임 종료");
      gameRoom.game.endGame();

      const response = {
        losers: gameRoom.getGame.getGResult.getLosers,
        penalty: gameRoom.getGame.getGResult.getPenalty,
        score: Object.fromEntries(gameRoom.getGame.getGResult.getScore),
      };

      console.log("response", response);
      io.to(gameRoom.roomId).emit("result", response);

      gameRoom.deleteGame();
    }
  });
};
