const Room = require("./Room");

class MainEvent {
  constructor() {
    this.roomList = new Array();
  }

  logRoomList() {
    for (let i = 0; i < this.roomList.length; i++)
      console.log(this.roomList[i].users);
  }

  createRoom(user, roomId) {
    let room = new Room(roomId, user.userName);
    room.addUser(user);
    this.roomList.push(room);
  }

  joinRoom(user, roomId) {
    let index;
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].getRoomId === roomId) {
        index = i;
        break;
      }
    }
    this.roomList[index].addUser(user);
  }

  deleteRoom(roomId) {
    let index;
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].getRoomId === roomId) {
        index = i;
        break;
      }
    }
    this.roomList.splice(index, 1);
  }
}

module.exports = MainEvent;
