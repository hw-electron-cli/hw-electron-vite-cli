/*
 * @Description:
 * @Author: weiyang
 * @Date: 2021-10-27 17:34:06
 * @LastEditors: weiyang
 * @LastEditTime: 2021-10-27 17:59:07
 */
import axios from "axios";
import { getToken, removeToken } from "./auth";
import { ElMessage } from "element-plus";
// import store from "@/store";
// import { authCode } from "@/config/authCode";

// 创建axios实例
const service = axios.create({
  baseURL: "/api", // api的base_url
  timeout: 3000, // 请求超时时间
  withCredentials: true
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  // transformResponse: [
  //   function (data) {
  //     /* eslint-disable no-undef */
  //     return jsonlint.parse(data);
  //   }
  // ]
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["token"] = getToken();
    config.headers["Accept"] = "*/*";
    if (config.mock) {
      config.baseURL = "/mock";
    }
    if (config.formData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

const handlerErrorMsg = message => {
  if (isMobile) {
    Notify({
      type: "primary",
      message
    });
  } else {
    // ElMessage({
    //   type: "error",
    //   message
    // });
    Toast({
      content: message,
      type: "warning"
    });
  }
};

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response.data.data ?? response.data;
      } else if (response.data.code === 500 || response.data.errCode === 500) {
        if (!response.config.callback) {
          handlerErrorMsg(response.data.msg);
        }
        if (response.data.msg === "登录状态已过期") {
          removeToken();
        }
        return Promise.reject(response.data);
      } else if (authCode[response.data.code]) {
        handlerErrorMsg(response.data.msg);
        removeToken();
        return Promise.reject(response.data);
      } else {
        if (!response.config.callback) {
          handlerErrorMsg(response.data.msg);
        }
        if (response.data.msg === "登录状态已过期") {
          removeToken();
        }
        return Promise.reject(response.data);
      }
    } else {
      handlerErrorMsg("系统正忙，请稍后再试。。。");
      return Promise.reject(response.data);
    }
  },
  error => {
    handlerErrorMsg("系统正忙，请稍后再试。。。");
    return Promise.reject(error);
  }
);

export default service;
