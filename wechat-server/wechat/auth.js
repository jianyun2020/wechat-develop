// 引入sha1模块
const sha1 = require('sha1');

// 引入配置对象模块
const config = require('../config');

// 引入tool模块
const { getUserDataAsync, parseXMLAsync, formatMessage } = require('../utils/tool')

module.exports = () => {

  return async (req, res, next) => {
    // 微信服务器提交的参数
    /* 
    {
      signature: '99cfdcea8465039cff31719a175018be35139fdc', 微信的加密签名
      echostr: '2130317713602358623', 微信的随机字符串
      timestamp: '1625893148', 微信发送的请求时间戳
      nonce: '1341979595' 微信的随机数字
    }
    */

    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = config;
  
    const arr = [token, timestamp, nonce];
    arr.sort(); // 字典序排序
    const str = arr.join('');
    const sha1Str = sha1(str); // sha1加密
    
    if (req.method === 'GET') {
      if (sha1Str === signature) {
        // 消息来自微信服务器，返回echostr给微信服务器
        res.send(echostr);
      } else {
        // 消息不是来自微信服务器，返回error
        res.end('error');
      }
    } else if (req.method === 'POST') {
      if (!sha1 === signature) {
        res.end('error')
      }

      // console.log(req.query)
      // {
      //   signature: '72400bafbff4f64ca620e2fa8db0b199d5e28bf8',
      //   timestamp: '1627454174',
      //   nonce: '1191390828',
      //   openid: 'oZNUz6gogl94mwyfd6qlfRegNNYI'
      // }
      
      // 接受请求体中的数据，
      const xmlData = await getUserDataAsync(req);

      // console.log(xmlData)
      // <xml><ToUserName><![CDATA[gh_b17c48dca141]]></ToUserName>
      // <FromUserName><![CDATA[oZNUz6gogl94mwyfd6qlfRegNNYI]]></FromUserName>
      // <CreateTime>1627454915</CreateTime>
      // <MsgType><![CDATA[text]]></MsgType>
      // <Content><![CDATA[1]]></Content>
      // <MsgId>23299550984543768</MsgId>
      // </xml>

      // 解析xml为js对象
      const jsData = await parseXMLAsync(xmlData);
      // console.log(jsData)
      // {
      //   xml: {
      //     ToUserName: [ 'gh_b17c48dca141' ],
      //     FromUserName: [ 'oZNUz6gogl94mwyfd6qlfRegNNYI' ],
      //     CreateTime: [ '1627455572' ],
      //     MsgType: [ 'text' ],
      //     Content: [ 'q' ],
      //     MsgId: [ '23299558863888989' ]
      //   }
      // }

      // 格式化数据
      
      const message = formatMessage(jsData);
      // console.log(message)
      // {
      //   ToUserName: 'gh_b17c48dca141',
      //   FromUserName: 'oZNUz6gogl94mwyfd6qlfRegNNYI',
      //   CreateTime: '1627456116',
      //   MsgType: 'text',
      //   Content: '1',
      //   MsgId: '23299569001712404'
      // }

      if (message.MsgType === 'text') {
        if (message.Content === '1') {
          content = '你真帅'
        } else if (message.Content.match('爱')) {
          content = 'wooooo'
        }
      }

      let replyMessage = `
      <xml>
        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
        <CreateTime>${Date.now()}}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
      </xml>
      `
      
      res.end(replyMessage)
    } else {
      // 消息不是来自微信服务器，返回error
      res.end('error');
    }


  }
}