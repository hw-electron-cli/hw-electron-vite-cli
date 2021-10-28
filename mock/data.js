/*
 * @Description: mock接口
 * @Autor: zhangyonghui
 * @Date: 2021-04-23 11:22:09
 * @LastEditors: zhangyonghui
 * @LastEditTime: 2021-04-23 14:16:49
 */
// import request from "@/utils/request";
// /**
//  * @description: 模拟获取数据接口
//  * @param  {*}
//  * @return {*}
//  * @Autor: zhangyonghui
//  * @Date: 2021-04-15 17:02:25
//  * @param {*} data
//  */
// export function getData(params) {
//   return request({
//     url: "/data/getData",
//     method: "get",
//     params,
//     mock: true
//   });
// }
// /**
//  * @description: 模拟发送数据接口
//  * @param  {*}
//  * @return {*}
//  * @Autor: zhangyonghui
//  * @Date: 2021-04-15 17:03:23
//  * @param {*} data
//  */
// export function postData(data) {
//   return request({
//     url: "/data/postData",
//     method: "post",
//     data,
//     mock: true
//   });
// }
const Mock = require("mockjs");
// 拓展mockjs
Mock.Random.extend({
  phone() {
    const phonePrefixs = ["132", "135", "189"];
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/); // Number()
  },
  tel() {
    const phonePrefixs = ["025-", "021-", "027-"];
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/); // Number()
  },
});

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      code: /[A-Z]{3}\d{4,5}/,
      name: "@province@cword(2,4)",
      tel: "@tel",
      phone: "@phone",
      "version|1": [0, 1, 2],
      time: '@date("yyyy年MM月dd日") 剩余@natural(0,1000)天',
      peopleNumber: "@integer(20,99)",
      area: "@county(true)",
      createTime: '@date("yyyy年MM月dd日")',
      services: {
        beginTime: '@date("yyyy年MM月dd日")',
        endTime: '@date("yyyy年MM月dd日")',
        remainDays: "365",
        projectNumber: "@natural(1, 10)",
        capacity: "@natural(1, 400)GB",
        usedCapacity: "@natural(1, 400)GB",
      },
      principal: "@cname",
    })
  );
}

module.exports = [
  {
    url: "/data/getData",
    type: "get",
    response: (config) => {
      const { name, page = 1, size = 20, sort } = config.query;

      let mockList = List.filter((item) => {
        if (name && item.name.indexOf(name) < 0) {
          return false;
        }
        return true;
      });

      if (sort === "-id") {
        mockList = mockList.reverse();
      }

      // eslint-disable-next-line no-unused-vars
      const pageList = mockList.filter(
        (item, index) => index < size * page && index >= size * (page - 1)
      );

      return {
        code: 200,
        data: {
          total: mockList.length,
          records: pageList,
        },
      };
    },
  },
  {
    url: "/data/postData",
    type: "post",
    response: () => {
      return {
        code: 200,
        message: "提交成功",
      };
    },
  },
];
