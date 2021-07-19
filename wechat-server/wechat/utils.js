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