// 回复用户消息模块

module.exports = message => {
   // 回复的options
   let options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: Date.now(),
    msgType: 'text',
  }

  switch (message.MsgType) {
    case 'text':
      if (message.Content === '邀请码') {
        content = '你真帅'
      } else if (message.Content.match('爱')) {
        content = 'wooooo'
      }
      break;
    case 'event':
      if (message.Event === 'subscribe') {
        // 用户订阅事件
        content = '欢迎您的关注~'
      } else if (message.Event === 'unsubscribe') {
        // 取消订阅
      }
      
      break;
  
    default:
      break;
  }

  options.content = content;

  return options;
}