const DBAccess = require("../config/DBAccess");
const Game = require("./Game");
const db = new DBAccess();

class BalanceGame extends Game {
  constructor(gameType, roomId) {
    super(gameType, roomId);
    this.choices = [];
  }

  get getChoices() {
    return this.choices;
  }

  async startGame() {
    console.log(this.roomId + "에서 밸런스 게임을 시작했습니다.");
    await this.setChoiceFromDB().then(() => {
      console.log(this.roomId + " 선택지: " + this.choices);
      this.getGResult.randomCreatePenalty();
    });
  }

  endGame() {
    console.log(this.getRoomId, "최종 Score", this.getGResult.getScore);
    this.decideLosers();
  }

  decideLosers() {
    const resultToMap = new Map();
    let options = [];

    this.getGResult.getScore.forEach((value) => {
      if (resultToMap.has(value)) {
        resultToMap.set(value, resultToMap.get(value) + 1);
      } else {
        resultToMap.set(value, 1);
        options.push(value);
      }
    });

    let result = [];
    if (resultToMap.get(options[0]) == resultToMap.get(options[1])) {
      this.getGResult.getScore.forEach((value, key = key) => {
        result.push(key);
      });
    } else if (resultToMap.get(options[0]) > resultToMap.get(options[1])) {
      this.getGResult.getScore.forEach((value, key) => {
        if (value == options[1]) result.push(key);
      });
    } else {
      this.getGResult.getScore.forEach((value, key) => {
        if (value == options[0]) result.push(key);
      });
    }

    console.log(this.getRoomId, "패자는 : " + result);
    this.getGResult.losers = result;
  }

  async setChoiceFromDB() {
    db.setSqlQuery = "select * from options order by rand() limit 1";

    await db.executeQuery().then((result) => {
      this.choices.push(result["option1"]);
      this.choices.push(result.option2);
    });
  }
}

module.exports = BalanceGame;
