const mysql = require("mysql");

//프로그램 server와 Mysql를 연동하기 위한 class
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
    //DB와의 연결을 종료하는 method
    this.connection.end();
  }

  executeQuery() {
    //비동기 DB를 처리 -> DB 작업이 마무리 된 후 select 결과를 전달
    return new Promise((resolve, reject) => {
      this.dbConnect();
      this.connection.query(this.sqlQuery, async (err, rows) => {
        if (err) throw err;
        resolve(rows[0]);
        this.dbDisconnect();
      });
    });
  }
}

module.exports = DBAccess;
