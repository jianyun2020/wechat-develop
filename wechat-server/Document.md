# 接口测试号申请

微信官方文档·公众号->开始开发->[接口测试号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

# 开发者需要有自己的服务器和微信服务器通信

## 使用Express搭建服务器

1. 初始化wechat-server为node项目：`npm init -y`
2. 安装express包 `npm install express`
3. 新建app.js

## 通过ngrok内网穿透工具将本地IP映射为公网IP

1. 打开ngrok工具
2. 映射端口号：`ngrok http 3000`
3. 将获取到的远程地址填入测试号接口配置信息URL中（Token自填）

# 开发者服务器验证消息是否来自微信服务器

1. 将参与微信签名的三个参数(token, timestamp, nonce)进行字典序排序
2. 将三个参数字符串拼接成一个字符串进行sha1加密
3. 将加密后的字符串与signature进行对比
   1. 如果一样，则说明来自微信服务器，返回echostr给微信服务器
   2. 如果不一样，则说明不是微信服务器发送的消息，返回error

# 获取Access token

access_token是公众号的全局唯一接口调用凭据

整体思路：

将获取到的access_token保存为本地文件

请求时直接读取本地文件(readAccessToken)

- 本地有文件
  - 判断是否过期(isValidAccessToken)
    - 过期了
      - 重新获取access_token(getAccessToken)，并保存覆盖之前的文件（保证文件唯一）(saveAccessToken)
    - 没有过期
      - 直接使用
- 本地没有文件
  - 发送请求获取access_token(getAccessToken)，保存为本地文件(saveAccessToken)，直接使用


# 链接数据库(Mysql)

1. 安装：`npm install mysql`
2. 连接数据库：

```js
const mysql = require('mysql');

const connection = mysql.crateConnection({
  host: 'localhost', // 主机名
  user: 'root', // 用户名
  password: 'root', // 用户密码
  database: 'wechat' // 数据库名
})

connection.connect();
```