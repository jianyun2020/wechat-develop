const rp = require("request-promise-native");
const FormData = require("form-data");
const rps = require("request-promise");
const axios = require("axios");
const { resolve } = require("path");
const qs = require("querystring");
const { writeFile, readFile, readFileSync, createReadStream } = require("fs");

// 引入config模块
const { appID, appsecret } = require("../config");
// 引入api模块
const api = require('../utils/api');

// 定义类，获取access_token
class Wechat {
  constructor() {}

  /**
   * @description: 用来获取access_token
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  getAccessToken() {
    // 定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;

    return new Promise((resolve, reject) => {
      rp({ method: "GET", url, json: true })
        .then((res) => {
          // 设置access_token的过期时间
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;

          // 更改Promise的状态为成功
          resolve(res);
        })
        .catch((err) => {
          // 更改Promise的状态为失败
          reject("getAccessToken方法出了问题：" + err);
        });
    });
  }

  /**
   * @description: 用来保存access_token
   * @param {*} accessToken：要保存的凭据
   * @return {*}
   * @author: jianyun
   */
  saveAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
      // 将对像转换为json字符串
      accessToken = JSON.stringify(accessToken);
      // 将accessToken保存为文件
      writeFile("./accessToken.txt", accessToken, (err) => {
        if (!err) {
          console.log("文件保存成功~");
          resolve();
        } else {
          reject("saveAccessToken方法出了问题：", err);
        }
      });
    });
  }

  /**
   * @description: 从accessToken.txt文件中读取access_token
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  readAccessToken() {
    return new Promise((resolve, reject) => {
      readFile("./accessToken.txt", (err, data) => {
        if (!err) {
          // 将data转换为js对象
          data = JSON.parse(data);
          console.log("文件读取成功~");
          resolve(data);
        } else {
          reject("readAccessToken方法出了问题：" + err);
        }
      });
    });
  }

  /**
   * @description: 检验access_token是否在有效期内
   * @param {*} data
   * @return {*}
   * @author: jianyun
   */
  isValidAccessToken(data) {
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
  fetchAccessToken() {
    // 优化
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      // 说明之前保存过access_token，并且未过期，可以直接使用
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in,
      });
    }

    return this.readAccessToken()
      .then(async (res) => {
        // 本地有文件，判断是否过期
        if (this.isValidAccessToken(res)) {
          // 有效的
          return Promise.resolve(res);
        } else {
          // 过期了，发送请求重新获取
          const res = await this.getAccessToken();
          // 保存为本地文件
          await this.saveAccessToken(res);

          return Promise.resolve(res);
        }
      })
      .catch(async (err) => {
        // 本地没有文件
        // 发送请求获取
        const res = await this.getAccessToken();
        // 保存为本地文件
        await this.saveAccessToken(res);

        return Promise.resolve(res);
      })
      .then((res) => {
        // 将access_token挂在到this上
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      });
  }

  /* =================================获取js-sdk所需ticket Start============================= */

  // 获取ticket
  getTicket() {

    return new Promise(async (resolve, reject) => {
      // 获取access_token
      const data = await this.fetchAccessToken();
      // 定义请求地址
      const url = `${api.ticket}&accecc_token=${data.access_token}`;
      
      // 发送请求
      rp({method: 'GET', url, json: true})
        .then(res => {
          resolve({
            ticket: res.ticket,
            expires_in: Date.now() + (res.expires_in - 300) * 1000
          })
        })
      
    })
  }
  /* =================================获取js-sdk所需ticket End============================= */

  /**
   * @description: 上传图片
   * @param {*} buffer
   * @return {*}
   * @author: jianyun
   */
  uploadImage(fileName) {
    // 获取文件绝对路径
    const filePath = resolve(__dirname, "../assets/images", fileName);

    return new Promise(async (resolve, reject) => {
      const { access_token } = await this.fetchAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${access_token}`;
      // 使用request-promise-native库
      // const formData = {
      //   buffer: createReadStream(filePath)
      // }
      // const result = rp({
      //   method: 'POST',
      //   url,
      //   json: true,
      //   formData
      // })

      let formData = new FormData();
      formData.append("buffer", createReadStream(filePath));

      let headers = formData.getHeaders(); //获取headers
      //获取form-data长度
      formData.getLength(async function (err, length) {
        if (err) {
          return;
        }
        //设置长度，important!!!
        headers["content-length"] = length;

        await axios
          .post(url, formData, { headers })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject("出错：" + err);
          });
      });
    });
  }

  /**
   * @description: 创建卡券
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  createCard() {
    return new Promise(async (resolve, reject) => {
      const { access_token } = await this.fetchAccessToken();
      let url = `https://api.weixin.qq.com/card/create?access_token=${access_token}`;
      let logo_url = await this.uploadImage("logo.jpg");
      console.log("logo_url: ", logo_url.url);
      let data = {
        card: {
          card_type: "MEMBER_CARD",
          member_card: {
            background_pic_url: "http://mmbiz.qpic.cn/mmbiz/p98FjXy8LacgHxp3sJ3vn97bGLz0ib0Sfz1bjiaoOYA027iasqSG0sjpiby4vce3AtaPu6cIhBHkt6IjlkY9YnDsfw/0",
            base_info: {
              logo_url: "http://mmbiz.qpic.cn/mmbiz_jpg/4a0hekXZLVxCXosPxLgMso9nTGERAH56iblqcu062aSibNOA6KWCDia6IKIkeP94O9QButprFDaSe7FQgjxUR6oBg/0",
              brand_name: "海底捞",
              code_type: "CODE_TYPE_TEXT",
              title: "海底捞会员卡",
              color: "Color010",
              notice: "使用时向服务员出示此券",
              service_phone: "020-88888888",
              description: "不可与其他优惠同享",
              date_info: {
                type: "DATE_TYPE_PERMANENT",
              },
              sku: {
                quantity: 50000000,
              },
              get_limit: 3,
              use_custom_code: false,
              can_give_friend: true,
              location_id_list: [123, 12321],
              custom_url_name: "立即使用",
              custom_url: "http://weixin.qq.com",
              custom_url_sub_title: "6个汉字tips",
              promotion_url_name: "营销入口1",
              promotion_url: "http://www.qq.com",
              need_push_on_view: true,
            },
            advanced_info: {
              use_condition: {
                accept_category: "鞋类",
                reject_category: "阿迪达斯",
                can_use_with_other_discount: true,
              },
              abstract: {
                abstract: "微信餐厅推出多种新季菜品，期待您的光临",
                icon_url_list: [
                  "http://mmbiz.qpic.cn/mmbiz/p98FjXy8LacgHxp3sJ3vn97bGLz0ib0Sfz1bjiaoOYA027iasqSG0sjpiby4vce3AtaPu6cIhBHkt6IjlkY9YnDsfw/0",
                ],
              },
              text_image_list: [
                {
                  image_url:
                    "http://mmbiz.qpic.cn/mmbiz/p98FjXy8LacgHxp3sJ3vn97bGLz0ib0Sfz1bjiaoOYA027iasqSG0sjpiby4vce3AtaPu6cIhBHkt6IjlkY9YnDsfw/0",
                  text: "此菜品精选食材，以独特的烹饪方法，最大程度地刺激食 客的味蕾",
                },
                {
                  image_url:
                    "http://mmbiz.qpic.cn/mmbiz/p98FjXy8LacgHxp3sJ3vn97bGLz0ib0Sfz1bjiaoOYA027iasqSG0sjpiby4vce3AtaPu6cIhBHkt6IjlkY9YnDsfw/0",
                  text: "此菜品迎合大众口味，老少皆宜，营养均衡",
                },
              ],
              time_limit: [
                {
                  type: "MONDAY",
                  begin_hour: 0,
                  end_hour: 10,
                  begin_minute: 10,
                  end_minute: 59,
                },
                {
                  type: "HOLIDAY",
                },
              ],
              business_service: [
                "BIZ_SERVICE_FREE_WIFI",
                "BIZ_SERVICE_WITH_PET",
                "BIZ_SERVICE_FREE_PARK",
                "BIZ_SERVICE_DELIVER",
              ],
            },
            supply_bonus: true,
            supply_balance: false,
            prerogative: "test_prerogative",
            auto_activate: true,
            custom_field1: {
              name_type: "FIELD_NAME_TYPE_LEVEL",
              url: "http://www.qq.com",
            },
            activate_url: "http://www.qq.com",
            custom_cell1: {
              name: "使用入口2",
              tips: "激活后显示",
              url: "http://www.qq.com",
            },
            bonus_rule: {
              cost_money_unit: 100,
              increase_bonus: 1,
              max_increase_bonus: 200,
              init_increase_bonus: 10,
              cost_bonus_unit: 5,
              reduce_money: 100,
              least_money_to_use_bonus: 1000,
              max_reduce_bonus: 50,
            },
            discount: 10,
          },
        },
      };
      data = JSON.stringify(data);

      axios({
        method: "post",
        url,
        data
      }).then((res) => {
        resolve(res.data);
      });
    });
  }

  /**
   * @description: 设置测试白名单
   * @param {*} openid
   * @return {*}
   * @author: jianyun
   */
  setWhiteList (openidArr) {
    
    return new Promise(async (resolve, reject) => {

      const { access_token } = await this.fetchAccessToken();
      let url = `https://api.weixin.qq.com/card/testwhitelist/set?access_token=${access_token}`;

      let data = {
        "openid": [...openidArr]
      }

      axios({
        method: 'post',
        url,
        data
      }).then(res => {
        resolve(res.data);
      })
    })
  }

  /**
   * @description: 创建二维码接口
   * @param {*}
   * @return {*}
   * @author: jianyun
   */
  createQRCode () {

    return new Promise(async (resolve, reject) => {
      const { access_token } = await this.fetchAccessToken();
      const { card_id } = await this.createCard();
      console.log('card_id: ', card_id);
      const { errcode } = await this.setWhiteList(["oZNUz6vmxUMshDE40a8vApbdH3x0", "oZNUz6gogl94mwyfd6qlfRegNNYI"]);
      let url = `https://api.weixin.qq.com/card/qrcode/create?access_token=${access_token}`;
      if (errcode === 0) {
        let data = {
          "action_name": "QR_CARD",
          "expire_seconds": 7200,
          "action_info": {
              "card": {
                  "card_id": card_id,
                  "outer_str": "12b"
              }
          }
        }

        axios.post(url, data).then(res => {
          resolve(res.data);
        })
      }
    })
  }

  /**
   * @description: 更新会员信息
   * @param {*} code
   * @return {*}
   * @author: jianyun
   */
  updateVipInfo (code) {
    
    return new Promise(async (resolve, reject) => {
      const { access_token } = await this.fetchAccessToken();
      let url = `https://api.weixin.qq.com/card/membercard/updateuser?access_token=${access_token}`;
      let data = {
        "code": code,
        "card_id": "pZNUz6hxXbuTklkEfqSSuMeTDGGE",
        "record_bonus": "推荐新用户，获得100积分",
        "add_bonus": -500,
      }

      axios.post(url, data).then(res => {
        console.log(res.data);
      })
    })
  }
}

let w = new Wechat();

w.updateVipInfo('668862585915')


// card_id:  pZNUz6hxXbuTklkEfqSSuMeTDGGE
// ticket: 'gQG68DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyelZTaVFkQWxjUEcxV3FDSmh3NGEAAgSSn_1gAwQIBwAA',