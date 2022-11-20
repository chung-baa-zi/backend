const User = require("./User");

class Room {
  constructor(roomId, gameManager) {
    this.roomId = roomId;
    this.gameManager = gameManager;
    this.gameType = 0;
    this.users = [];
    this.roomSize = 0;
  }

  get getRoomId() {
    return this.roomId;
  }

  get getGameManager() {
    return this.gameManager;
  }

  get getGameType() {
    return this.gameType;
  }

  get getUsers() {
    return this.users;
  }

  get getRoomSize() {
    return this.roomSize;
  }

  set setGameType(gameType) {
    this.gameType = gameType;
  }

  addUser(user) {
    this.users.push(user);
    this.roomSize++;
  }
  deleteUser(userName) {
    let index;
    for (let i = 0; i < this.roomSize; i++) {
      if (this.users[i].getUserName === userName) {
        index = i;
        break;
      }
    }
    this.users.splice(index, 1);
    this.roomSize--;

    //방장이 나갈 시 방장 이름 체인지
  }

  changeGameManager(userName) {
    this.gameManager = userName;
  }
}

module.exports = Room;
