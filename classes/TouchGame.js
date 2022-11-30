const Game = require("./Game");

//터치 게임 data와 method를 저장하는 class
class TouchGame extends Game {
  //Game class를 상속받음
  constructor(gameType, roomId) {
    super(gameType, roomId);
  }

  async startGame() {
    console.log(this.roomId + "에서 터치 게임을 시작했습니다.");
    await this.getGResult.randomCreatePenalty(); //게임 시작 시 랜덤으로 벌칙을 DB에서 select
  }

  endGame() {
    console.log(this.getRoomId, "최종 Score", this.getGResult.getScore);
    this.decideLosers();
    //this.gResult.randomCreatePenalty();
  }

  decideLosers() {
    //최송 score를 통해 패자들을 결정하는 method
    const resultToMap = new Map(
      Array.from(this.getGResult.getScore).sort((a, b) => a[1] - b[1]) //Map 형태의 score를 array로 변형 후 정렬
    );

    const result = [...resultToMap.keys()]; //정렬된 Map의 keys 값들만 배열로 저장

    console.log(this.getRoomId, "패자는 : " + result[0]);
    this.getGResult.losers = result[0];
  }
}

module.exports = TouchGame;
