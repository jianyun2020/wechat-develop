const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'wechat'
});

db.connect(err => {
  if (err) throw err;
  console.log('数据库连接成功...');
});

// // 创建表
// let sql1 = `CREATE TABLE IF NOT EXISTS user_info(
//   id INT UNSIGNED AUTO_INCREMENT,
//   openid VARCHAR(32) NOT NULL UNIQUE,
//   phone_number INT(11),
//   invatation_code VARCHAR(100),
//   is_active INT(1) DEFAULT 0,
//   PRIMARY KEY (id, openid)
// )`

// db.query(sql1, (error, results, fields) => {
//   if (error) throw error;
//   console.log(results)
// })

// // 插入数据
// let sql2 = `INSERT INTO user_info (openid) VALUES ('o6_bmjrPTlm6_2sgVt7hMZOPfL2M')`;

// db.query(sql2, (error, results, fields) => {
//   if (error) throw error;
//   console.log(results)
// })

let sq3 = `SELECT openid FROM user_info WHERE openid = 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M'`

function gg () {

  return new Promise(async (resolve, reject) => {
    let res = await db.query(sq3, (error, results, fields) => {
      if (error) throw error;
      resolve(results)
    })
  })

}
gg().then(res => {
  console.log(res)
});


db.end();
