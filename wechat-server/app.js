// 引入express模块
const express = require('express');
// 引入sha1模块
const sha1 = require('sha1');

// 引入auth模块
const auth = require('./wechat/auth');
// 引入Wechat模块
const Wechat = require('./wechat/wechat');

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
  
  /**
   * 签名生成规则:
   *  1.参与签名的字段：noncestr(随机字符串), 有效的jsapi_ticket, timestamp(时间戳), url(当前网页的URL，不含#号及后面的部分)
   *  2.对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。
   *  3.对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
   */

  // 渲染页面，将渲染好的页面返回给用户
  res.render('search');
})

// 微信验证中间件
app.use(auth());



// 监听端口号
app.listen(3000, () => console.log('服务器启动成功~'))