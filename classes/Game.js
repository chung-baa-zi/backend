const GameResult = require("./GameResult");

//각 게임의 추상 클래스로 메소드들을 overriding 필수
module.exports = class Game {
  constructor(gameType, roomId) {
    this.gameType = gameType;
    this.roomId = roomId;
    this.gResult = new GameResult();

    if (this.constructor === Game) {
      //추상 메소드를 구현하기 위해 자신의 instance를 생성을 막음
      throw new Error("This is Abstract Class!");
    }
  }

  get getRoomId() {
    return this.roomId;
  }
  get getGResult() {
    return this.gResult;
  }

  //추상 메소드 overriding 필요
  startGame() {}
  endGame() {}
  decideLosers() {}
};
