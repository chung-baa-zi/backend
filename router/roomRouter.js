const User = require("../classes/User");

module.exports.join = function (io, socket, mainEvent) {
  socket.on("join", function (data) {
    console.log(socket.id, data);
    //client측에서 받은 data를 파싱
    socket.name = data.name;
    socket.roomId = data.roomId;
    socket.state = "true";

    //client 측에서 입력한 roomId와 일치한 방을 찾는다.
    let roomUpdate = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    //roomId와 일치하는 방이 존재할 시
    if (roomUpdate) {
      if (roomUpdate.getRoomSize == 6) {
        //존재하지만 정원이 초과할 시
        socket.emit("join", {
          state: "error",
          msg: "방이 유저가 가득 찼습니다.",
        });
        socket.state = "false";
        //socket.disconnect();
      } else {
        let userList = roomUpdate.users.map((object) => {
          return object.getUserName;
        });
        // 닉네임 중복
        if (userList.indexOf(socket.name) != -1) {
          socket.emit("join", {
            state: "error",
            msg: "방 안에서 닉네임이 중복입니다.",
          });
          socket.state = "false";
          //socket.disconnect();
        } else {
          //정상적으로 유저 접속
          const user = new User(socket.name, socket); //유저 객체를 생성한다.
          roomUpdate.addUser(user); //방이 존재할 경우 정상적으로 유저를 방 객체에 add한다.
          //소켓 통신으로 data를 공유하기 위해 필요한 data만 추출한다.
          let users = roomUpdate.getUsers.map((object) => {
            return object.userName;
          });

          const response = {
            state: "200",
            users: users,
          };

          socket.join(socket.roomId); //소켓 룸에 입장
          console.log("response: " + users);
          io.to(socket.roomId).emit("join", response); //같은 roomId에 속한 socket에만 data를 전송한다.
          console.log(socket.roomId + ": " + socket.name + "님이 방에 입장.");
        }
      }
      // 방이 없을때
    } else {
      socket.emit("join", { state: "error", msg: "방이 존재하지 않습니다." });
      socket.state = "false";
      //socket.disconnect();
    }
  });
};

module.exports.create = function (socket, mainEvent) {
  socket.on("create", (data) => {
    socket.name = data.name;
    socket.roomId = data.roomId;
    socket.state = "true";

    console.log(socket.id, data);

    let roomUpdate = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    //roomId의 방이 이미 존재할 시
    if (roomUpdate) {
      console.log(socket.roomId + "중복");
      socket.state = "false";
      socket.emit("create", { state: "error", msg: "방 아이디가 중복입니다." });
      //socket.disconnect();
    } else {
      const user = new User(socket.name, socket); //유저를 생성 후 유저를 방장으로 설정해 방을 생성한다.
      mainEvent.createRoom(user, socket.roomId);

      const response = {
        state: "200",
      };

      socket.join(socket.roomId);
      socket.emit("create", response);
      console.log(socket.roomId + ": " + socket.name + "님이 방을 생성.");
    }
  });
};

//정상적인 퇴장일 때
module.exports.exit = function (io, socket, mainEvent) {
  socket.on("exit", () => {
    //퇴장한 유저의 방의 id로 room 객체를 찾는다.
    let roomUpdate = mainEvent.roomList.find(
      (m) => m.getRoomId === String(socket.roomId)
    );
    //방장이 방을 나갔을 때
    if (
      socket.name == roomUpdate.getGameManager &&
      roomUpdate.getRoomSize != 1
    ) {
      roomUpdate.changeGameManager(roomUpdate.users[1].userName);
      console.log(
        roomUpdate.getRoomId,
        "방장 변경 => ",
        roomUpdate.getGameManager
      );
    }
    roomUpdate.deleteUser(socket.name); //퇴장한 유저를 방에서 삭제한다.
    let users = roomUpdate.users.map((object) => {
      return object.getUserName;
    });

    const response = {
      state: "200",
      users: users,
    };

    socket.leave(socket.roomId);
    io.to(socket.roomId).emit("join", response);

    // 해당 방에 사람이 없으면 방 폭파~
    if (roomUpdate.getRoomSize == 0) {
      mainEvent.deleteRoom(roomUpdate.roomId);
      console.log(roomUpdate.getRoomId, ": 잔여인원 0 -> 방삭제");
    }

    console.log(socket.roomId + ": " + socket.name + "님이 방을 나감.");
  });
};

//비정상적인 퇴장일 때 (system을 강제로 종료시)
module.exports.disconnect = function (io, socket, mainEvent) {
  socket.on("disconnect", () => {
    //유저의 정보를 서버 상에서 삭제한다
    if (socket.state === "true") {
      //퇴장한 유저의 방의 id로 room 객체를 찾는다.
      let roomUpdate = mainEvent.roomList.find(
        (m) => m.getRoomId === String(socket.roomId)
      );
      //방장이 방을 나갔을 때
      if (
        socket.name == roomUpdate.getGameManager &&
        roomUpdate.getRoomSize != 1
      ) {
        roomUpdate.changeGameManager(roomUpdate.users[1].userName);
        console.log(
          roomUpdate.getRoomId,
          "방장 변경 => ",
          roomUpdate.getGameManager
        );
      }
      roomUpdate.deleteUser(socket.name); //퇴장한 유저를 방에서 삭제한다.
      let users = roomUpdate.users.map((object) => {
        return object.getUserName;
      });

      const response = {
        state: "200",
        users: users,
      };

      socket.leave(socket.roomId);
      io.to(socket.roomId).emit("join", response);

      // 해당 방에 사람이 없으면 방 폭파~
      if (roomUpdate.getRoomSize == 0) {
        mainEvent.deleteRoom(roomUpdate.roomId);
        console.log(roomUpdate.getRoomId, ": 잔여인원 0 -> 방삭제");
      }
    }

    console.log(socket.id + " 사용자가 청바지 시스템 종료.");
  });
};
