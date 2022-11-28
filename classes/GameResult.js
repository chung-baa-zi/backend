const DBAccess = require("../config/DBAccess");
const db = new DBAccess();

module.exports = class GameResult {
  constructor() {
    this.losers = [];
    this.penalty = null;
    this.score = new Map();
  }

  set setLosers(losers) {
    this.losers.push(losers);
  }

  get getLosers() {
    return this.losers;
  }
  get getPenalty() {
    return this.penalty;
  }
  get getScore() {
    return this.score;
  }

  async randomCreatePenalty() {
    db.sqlQuery = "select * from penalty order by rand() limit 1";

    await db.executeQuery().then((result) => {
      this.penalty = result.penalty;
    });
  }
};
