// 引入config模块
const { appID, appsecret } = require('../config')

const rp = require('request-promise-native');

// 定义类，获取access_token
class Wechat {
  constructor () {
    
  }

  /**
   * @description: 用来获取access_token
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  getAccessToken() {
    // 定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`

    rp({method: 'GET', url, json: true})
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const w = new Wechat();

w.getAccessToken();