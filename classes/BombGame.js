const Game = require("./Game");

class BombGame extends Game {
  constructor(gameType, roomId) {
    super(gameType, roomId);
    this.time = Math.floor(Math.random() * (15 - 0) + 10); // 15초에서 25초 사이
    this.randomUsers = [];
    this.bombOwnerIndex = 0;
    // 시작했는지 여부를 나타내는 플래그 추가
    this.isStarted = false;
  }

  runTimerAlarm() {
    if (this.time % 10 == 0) {
      console.log("현재시간 : " + this.time);
    }
    this.time = this.time - 0.1;
  }

  shuffleOrder(Users, roomSize) {
    for (let loop = Users.length - 1; loop >= 0; loop--) {
      let randomNum = Math.floor(Math.random() * (loop + 1));
      let randomArrayItem = Users[randomNum];

      Users[randomNum] = Users[loop];
      Users[loop] = randomArrayItem;
    }
    this.randomUsers = Users;
  }

  get getTime() {
    return this.time;
  }

  get getRandomUsers() {
    return this.randomUsers;
  }

  // 폭탄 소유자 idx getter 추가
  get getBombOwnerIndex() {
    return this.bombOwnerIndex;
  }

  // 플래그 getter 추가
  get getIsStarted() {
    return this.isStarted;
  }

  // 플래그 setter 추가
  set setIsStarted(isStarted) {
    this.isStarted = isStarted;
  }

  // username 필요없음
  setBombOwnerIndex() {
    this.bombOwnerIndex++;
    if (this.bombOwnerIndex >= this.randomUsers.length) {
      this.bombOwnerIndex = 0;
    }
  }

  async startGame() {
    console.log(this.roomId + "에서 폭탄 돌리기 게임을 시작했습니다.");
    await this.getGResult.randomCreatePenalty();
  }

  endGame() {
    console.log(this.getRoomId, "폭탄 돌리기 게임을 종료했습니다.");
    this.gResult.losers.push(this.randomUsers[this.bombOwnerIndex]);
  }
}

module.exports = BombGame;
