const User = require("./User");
const TouchGame = require("./TouchGame");
const BombGame = require("./BombGame");
const BalanceGame = require("./BalanceGame");

class Room {
  constructor(roomId, gameManager) {
    this.roomId = roomId;
    this.gameManager = gameManager;
    this.game = null;
    this.users = [];
    this.roomSize = 0;
  }

  get getRoomId() {
    return this.roomId;
  }

  get getGameManager() {
    return this.gameManager;
  }

  get getGame() {
    return this.game;
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

  createGame(gameType) {
    if (gameType == 1) {
      this.game = new TouchGame(gameType, this.roomId);
    } else if (gameType == 2) {
      this.game = new BombGame(gameType, this.roomId);
    } else if (gameType == 3) {
      this.game = new BalanceGame(gameType, this.roomId);
    }
  }

  deleteGame() {
    console.log(this.roomId, ": 게임을 종료합니다");
    delete this.game;
  }
}

module.exports = Room;
