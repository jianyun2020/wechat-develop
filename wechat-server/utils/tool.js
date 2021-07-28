const { parseString } = require('xml2js')

module.exports = {
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = '';
      req.on('data', data => {
        // 当流式数据传递过来时，会触发当前事件，会将数据注入到回调函数中
        // 读取的数据是buffer，需要将其转换成字符串
        xmlData += data.toString();
      }).on('end', () => {
        // 当数据接收完毕时，会触发当前事件
        resolve(xmlData)
      })
    })
  },
  parseXMLAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, {trim: true}, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject('parseXMLAsync方法出错： ' + err)
        }
      })
    })
  },
  formatMessage(jsData) {
    let message = {}
    jsData = jsData.xml
    if (typeof jsData === 'object') {
      for (let key in jsData) {
        let value = jsData[key]
        if (Array.isArray(value) && value.length > 0) {
          message[key] = value[0]
        }
      }
    }
    return message
  }
}