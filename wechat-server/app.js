// 引入express模块
const express = require('express');

// 引入auth模块
const auth = require('./wechat/auth');

// 创建app应用对象
const app = express();

// const mysql = require('mysql');

// const dbconfig = require('./db/dbconfig');

// const db = mysql.createConnection(dbconfig);

// app.get('/createdb', (req, res) => {
//   db.connect(err => {
//     if (err) throw err;
//     console.log('mysql connected...');
//   })
//   let sql = 'CREATE DATABASE wechat';

//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log('result: ', result);
//     res.send('Database created...');
//   })

//   db.end();
// })

// 接收处理所有消息
app.use(auth());
app.use(express.static('./bin/www'))

app.get('/hh', (req, res) => {
  res.send('hh')
})




// 监听端口号
app.listen(3000, () => console.log('服务器启动成功~'))