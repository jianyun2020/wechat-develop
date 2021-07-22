const mysql = require('mysql');

const connection = mysql.crateConnection({
  host: 'localhost', // 主机名
  user: 'root', // 用户名
  password: 'root', // 用户密码
  database: 'wechat' // 数据库名
})


connection.connect();
