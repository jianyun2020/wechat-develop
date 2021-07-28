
module.exports = options => {
  let replyMessage = `<xml>
    <ToUserName><![CDATA[${options.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.ToUserName}]]></FromUserName>
    <CreateTime>${Date.now()}}</CreateTime>
    <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
    
  switch (options) {
    case 'text':
      replyMessage += `<Content><![CDATA[${options.Content}]]></Content>`
      break;
  
  }  

  replyMessage += '</xml>'
}