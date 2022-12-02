const DBAccess = require("../config/DBAccess");
const Game = require("./Game");
const db = new DBAccess();

//밸런스 게임의 data와 method를 저장하는 class
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

    this.getGResult.getScore.forEach((value, key) => {
      //score map에 저장된 선택지 별 count를 계산
      if (value != "") {
        if (resultToMap.has(value)) {
          resultToMap.set(value, resultToMap.get(value) + 1);
        } else {
          resultToMap.set(value, 1);
          options.push(value);
        }
      } else {
        this.getGResult.losers.push(key);

        console.log(this.getGResult.losers);
      }
    });

    //선택지 별 count를 통해 패자들을 결정
    if (resultToMap.get(options[0]) == resultToMap.get(options[1])) {
      //각 선택지 count가 같을 경우 모두 패자
      this.getGResult.getScore.forEach((value, key = key) => {
        this.getGResult.losers.push(key);
      });
    } else if (resultToMap.get(options[0]) > resultToMap.get(options[1])) {
      this.getGResult.getScore.forEach((value, key) => {
        if (value == options[1]) this.getGResult.losers.push(key);
      });
    } else {
      this.getGResult.getScore.forEach((value, key) => {
        if (value == options[0]) this.getGResult.losers.push(key);
      });
    }

    console.log(this.getRoomId, "패자는 : " + this.getGResult.getLosers);
  }

  async setChoiceFromDB() {
    //랜덤으로 선택지를 DB로 부터 읽어옴
    db.setSqlQuery = "select * from options order by rand() limit 1";

    await db.executeQuery().then((result) => {
      this.choices.push(result["option1"]);
      this.choices.push(result.option2);
    });
  }
}

module.exports = BalanceGame;
