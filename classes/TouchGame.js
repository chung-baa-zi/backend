const Game = require("./Game");

class TouchGame extends Game {
  constructor(gameType, roomId) {
    super(gameType, roomId);
  }

  async startGame() {
    console.log(this.roomId + "에서 터치 게임을 시작했습니다.");
    await this.getGResult.randomCreatePenalty();
  }

  endGame() {
    console.log(this.getRoomId, "최종 Score", this.getGResult.getScore);
    this.decideLosers();
    this.gResult.randomCreatePenalty();
  }

  decideLosers() {
    const resultToMap = new Map(
      Array.from(this.getGResult.getScore).sort((a, b) => a[1] - b[1])
    );

    const result = [...resultToMap.keys()];

    console.log(this.getRoomId, "패자는 : " + result[0]);
    this.getGResult.losers = result[0];
  }
}

module.exports = TouchGame;
