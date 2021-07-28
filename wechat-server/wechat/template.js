
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
    case 'image':
      replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
      break;
    case 'voice':
      replyMessage += `  <Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
      break;
    case 'video':
      replyMessage += `<Video>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
      </Video>`
      break;
    case 'music':
      replyMessage += `<Music>
      <Title><![CDATA[${title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
    </Music>`
      break;
    case 'text':
      replyMessage += `<Content><![CDATA[${options.Content}]]></Content>`
      break;
  
  }  

  replyMessage += '</xml>'
}