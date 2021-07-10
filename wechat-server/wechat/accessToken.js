const rp = require('request-promise-native');
const { writeFile, readFile } = require('fs');

// 引入config模块
const { appID, appsecret } = require('../config')


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

    return new Promise((resolve, reject) => {
      rp({method: 'GET', url, json: true})
      .then(res => {
        // 设置access_token的过期时间
        res.expires_in = Date.now() + (res.expires_in - 300) * 1000;

        // 更改Promise的状态为成功
        resolve(res);
      })
      .catch(err => {
        // 更改Promise的状态为失败
        reject('getAccessToken方法出了问题：' + err);
      })
    })
  }

  /**
   * @description: 用来保存access_token
   * @param {*} accessToken：要保存的凭据
   * @return {*}
   * @author: jianyun
   */
  saveAccessToken (accessToken) {
    return new Promise((resolve, reject) => {
      // 将对像转换为json字符串
      accessToken = JSON.stringify(accessToken);
      // 将accessToken保存为文件
      writeFile('./accessToken.txt', accessToken, err => {
        if (!err) {
          console.log('文件保存成功~');
          resolve();
        } else {
          reject('saveAccessToken方法出了问题：', err);
        }
      })
    })
  }

  /**
   * @description: 从accessToken.txt文件中读取access_token
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  readAccessToken () {
    return new Promise((resolve, reject) => {
      readFile('./accessToken.txt', (err, data) => {
        if (!err) {
          // 将data转换为js对象
          data = JSON.parse(data);
          console.log('文件读取成功~');
          resolve(data);
        } else {
          reject('readAccessToken方法出了问题：' + err);
        }
      })
    })
  }

  /**
   * @description: 检验access_token是否在有效期内
   * @param {*} data
   * @return {*}
   * @author: jianyun
   */
  isValidAccessToken (data) {
    if (!data & !data.access_token & !data.expires_in) {
      return false;
    }

    return data.expires_in > Date.now();
  }

  /**
   * @description: 用来获取没有过期的access_token
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  fetchAccessToken () {
    // 优化
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      // 说明之前保存过access_token，并且未过期，可以直接使用
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }

    return this.readAccessToken()
      .then(async res => {
        // 本地有文件，判断是否过期
        if (this.isValidAccessToken(res)) {
          // 有效的
          return Promise.resolve(res);
        } else {
          // 过期了，发送请求重新获取
          const res = await this.getAccessToken();
          // 保存为本地文件
          await this.saveAccessToken(res);

          Promise.resolve(res);
        }
      })
      .catch(async err => {
        // 本地没有文件
        // 发送请求获取
        const res = await this.getAccessToken();
        // 保存为本地文件
        await this.saveAccessToken(res);

        Promise.resolve(res);
      })
      .then( res => {
        // 将access_token挂在到this上
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      })
  }
}