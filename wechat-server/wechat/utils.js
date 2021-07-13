/*
 * @Author: jianyun2020
 * @Date: 2021-07-12 21:47:54
 * @LastEditTime: 2021-07-12 21:55:20
 * @Description: 工具函数模块
 * @FilePath: \wechat-develop\wechat-server\wechat\utils.js
 */

module.exports = {
  /**
   * @description: 读取文件，返回Promise
   * @param {*} relativePath
   * @return {*}
   * @author: jianyun
   */
  UreadFile (relativePath) {
    
    return new Promise((resolve, reject) => {
      readFile(relativePath, (err, data) => {
        if (!err) {
          resolve(data)
        }
      })
    })
  }
}
