const { parseString } = require("xml2js");
const { resolve } = require('path');
const { writeFile, readFile } = require("fs");


module.exports = {
  // 接收用户发送的数据
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = "";
      req
        .on("data", (data) => {
          // 当流式数据传递过来时，会触发当前事件，会将数据注入到回调函数中
          // 读取的数据是buffer，需要将其转换成字符串
          xmlData += data.toString();
        })
        .on("end", () => {
          // 当数据接收完毕时，会触发当前事件
          resolve(xmlData);
        });
    });
  },
  // 解析接收到的xml数据
  parseXMLAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { trim: true }, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject("parseXMLAsync方法出错： " + err);
        }
      });
    });
  },
  // 格式化要回复给用户的信息
  formatMessage(jsData) {
    let message = {};
    jsData = jsData.xml;
    if (typeof jsData === "object") {
      for (let key in jsData) {
        let value = jsData[key];
        if (Array.isArray(value) && value.length > 0) {
          message[key] = value[0];
        }
      }
    }
    return message;
  },
  // 异步读取文件
  readFileAsync(fileName) {
    const filePath = resolve(__dirname, fileName);

    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (!err) {
          console.log('文件读取成功~');
          // 将json字符串转化为js对象
          data = JSON.parse(data);
          resolve(data);
        } else {
          reject('readFileAsync方法出错: ' + err);
        }
      })
    })
  },
  // 异步保存文件
  writeFileAsync(data, fileName) {
    // 将对象转化为字符串
    ticket = JSON.stringify(data);
    let filaPath = resolve(__dirname, fileName)
    return new Promise((resolve, reject) => {
      writeFile(filaPath, ticket, err => {
        if (!err) {
          console.log("文件保存成功");
          resolve();
        } else {
          reject("writeFileAsync方法出错： " + err);
        }
      });
    });
  },
};
