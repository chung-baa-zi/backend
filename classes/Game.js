const GameResult = require("./GameResult");

module.exports = class Game {
  constructor(gameType, roomId) {
    this.gameType = gameType;
    this.roomId = roomId;
    this.gResult = new GameResult();

    if (this.constructor === Game) {
      throw new Error("This is Abstract Class!");
    }
  }

  get getRoomId() {
    return this.roomId;
  }
  get getGResult() {
    return this.gResult;
  }

  // set setGResult(gResult) {
  //   this.gResult = gResult;
  // }

  //추상 메소드 overriding 필요
  startGame() {}
  endGame() {}
  decideLosers() {}
};
