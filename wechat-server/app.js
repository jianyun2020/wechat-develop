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

// 配置模板资源目录
app.set('views', './views');
// 配置模板引擎
app.set('view engine', 'ejs');

// 页面路由
app.get('/search', (req, res) => {

  // 渲染页面，将渲染好的页面返回给用户
  res.render('search');
})

// 微信验证中间件
app.use(auth());



// 监听端口号
app.listen(3000, () => console.log('服务器启动成功~'))