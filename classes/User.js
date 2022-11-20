class User {
  constructor(userName, socket) {
    this.userName = userName;
    this.socket = socket;
  }

  get getUserName() {
    return this.userName;
  }

  get getSocket() {
    return this.socket;
  }
}

module.exports = User;
