const mysql = require("mysql");

class DBAccess {
  constructor() {
    this.sqlQuery = "";
    this.connection = null;

    this.conn = {
      // mysql 접속 설정
      host: "localhost",
      port: "3306",
      user: "jean",
      password: "bluejean",
      database: "bluejean",
    };
  }

  set setSqlQuery(sqlQuery) {
    this.sqlQuery = sqlQuery;
  }

  dbConnect() {
    this.connection = mysql.createConnection(this.conn); // DB 커넥션 생성
    this.connection.connect();
  }

  dbDisconnect() {
    this.connection.end();
  }

  executeQuery() {
    this.dbConnect();
    return new Promise((resolve, reject) => {
      this.connection.query(this.sqlQuery, async (err, rows) => {
        if (err) throw err;
        resolve(rows[0]);
        this.dbDisconnect();
      });
    });
  }
}

module.exports = DBAccess;
