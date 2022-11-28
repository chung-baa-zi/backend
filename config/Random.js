class Random {
  constructor() {
    this.randomNum = null;
  }

  get randomNum() {
    return this.randomNum;
  }

  set setRandomInt(range) {
    this.randomNum = Math.floor(Math.random * range) + 1;
  }
}

module.exports = Random;
