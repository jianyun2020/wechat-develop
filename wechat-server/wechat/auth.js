// 引入sha1模块
const sha1 = require('sha1');

// 引入配置对象模块
const config = require('../config')

module.exports = () => {

  return (req, res, next) => {
    // 微信服务器提交的参数
    /* 
    {
      signature: '99cfdcea8465039cff31719a175018be35139fdc', 微信的加密签名
      echostr: '2130317713602358623', 微信的随机字符串
      timestamp: '1625893148', 微信发送的请求时间戳
      nonce: '1341979595' 微信的随机数字
    }
    */

    console.log('req: ', req)
    // console.log('res: ', res)
  
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = config;
  
    const arr = [token, timestamp, nonce];
    arr.sort(); // 字典序排序
    const str = arr.join('');
    const sha1Str = sha1(str); // sha1加密
  
    // if (sha1Str === signature) {
    //   // 消息来自微信服务器，返回echostr给微信服务器
    //   res.send(echostr);
    // } else {
    //   // 消息不是来自微信服务器，返回error
    //   res.end('error');
    // }

    next()
  }
}