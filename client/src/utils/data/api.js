import axios, { CancelToken } from "axios";
import config from "../../config/config";
import { detectTokenErr } from "../helper";

// const config = require("../../config/config");
const define = require("../../config/define");
// console.log('define :: ', define);
// const baseURL = config.apiBaseUrl;

// axios.interceptors.response.use((response) => {
//   return response;
// }, function (error) {
//   console.log('error ::', error);
//   // Do something with response error
//   if (error.response.status === 401) {
//       console.log('unauthorized, logging out ...');
//       auth.logout();
//       router.replace('/');
//   }
//   return Promise.reject(error.response);
// });
// console.log('API_BASE_URL :: ' + define.API_BASE_URL);
// console.log('WEBSOCKET_SERVER :: ' + define.WEBSOCKET_SERVER);
export const generateCancelToken = () => {
  return CancelToken.source();
};

export const apiClient = axios.create({
  baseURL: define.API_BASE_URL,
});

export const apiWithoutInterceptor = axios.create({
  baseURL: define.API_BASE_URL,
});

export const networkService = {
  setupInterceptors: (handleDirectToIntroPage) => {
    // request

    apiClient.interceptors.request.use(
      (config) => {
        if (!config.headers || !config.headers.Authorization) { // header가 외부에서 정의되지 않았을 경우에만 추가.
          config.headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // // response
    apiClient.interceptors.response.use(
      (response) => {
        return response;
      },

      (error) => {
        console.log("axios error message :", error.message);
        console.log("error ::", error.response.data);
        // const status = error.response.status

        const { code } = error.response.data;
        if (detectTokenErr(code)) {
          // const location = window.location;
          // window.alert("Your token has been expired. Please log in again ");

          localStorage.removeItem("token");
          handleDirectToIntroPage();
          //  console.log("history::", history)

          // history.push("/")
          // location.assign('/');

          // window.location.href = "/";
        }
        // toke error detection. -> 다시 로그인 해야 함. -> 사용자를 login page로 redirect
        // http status = 401
        // code : 1000, 1001, 1002, 1003, 9000, 9001
        return Promise.reject(error);
      }
    );
  },
};

// setModalManager((prev) => ({
//   ...prev,
//   alert: {
//     ...
//   }
// }))동의 여부를 체크해주세요

// your agreement of policy statue has been changed to true
