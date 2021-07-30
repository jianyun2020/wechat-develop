
module.exports = options => {
  let replyMessage = `<xml>
    <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}}</CreateTime>
    <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
    
  switch (options.msgType) {
    case 'text':
      replyMessage += `<Content><![CDATA[${options.content}]]></Content>`
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
    case 'news':
      replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
      <Articles>`
      options.content.forEach(item => {
        replyMessage += `
        <item>
        <Title><![CDATA[${item.title1}]]></Title>
        <Description><![CDATA[${item.description1}]]></Description>
        <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
        <Url><![CDATA[${item.url}]]></Url>
        </item>
        `
      })

      replyMessage += `</Articles>`
      break;
  }  

  replyMessage += '</xml>';

  return replyMessage;
}