import { apiClient } from "./data/api";
import moment from "moment";

export const findLocaleInStorage = () => {
  const locale = localStorage.getItem("locale");
  console.log("detect locale in localStorage::", locale);
  // if there is nothing , return null
  if (!locale) return null;
  if (locale === "en") return "en";
  return "kr";
};

// export const isKoreanPreferred = () => {
//   // The Accept-Language request HTTP header advertises which languages the client is able to understand, and which locale variant is preferred.
//   const language = window.navigator.userLanguage || window.navigator.language;
//   console.log("language ::", language);
//   if (language === "ko-KR") return true;
//   return language;
// };

export const mapObjToArr = (obj) => {
  if (!obj) return;
  const arr = [];
  for (const key in obj) {
    arr.push({ ...obj[key] });
  }

  return arr;
};

export const detectIe = () => {
  var ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE ");
  let rv = -1;

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    // If Internet Explorer, return version number
    if (isNaN(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))))) {
      // For IE 11 >
      if (navigator.appName == "Netscape") {
        var ua = navigator.userAgent;
        const re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) {
          rv = parseFloat(RegExp.$1);
          // e11;
          return true;
        }
      } else {
        // alert("otherbrowser");
      }
    } else {
      // For < IE11
      // alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
    }
    return false;
  }
};

export const downloadURI = (uri, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // delete link;
};

export const convertNumToArray = (total, currentPage) => {
  const arr = [];
  if (currentPage < 7) {
    for (let i = 0; i < total; i++) {
      if (i < 10) {
        arr.push(i + 1);
      } else {
        return arr;
      }
    }
  } else {
    // push start to currentpage
    for (let i = 1; i <= 6; i++) {
      arr.push(currentPage - 6 + i);
    }
    // push to end
    for (let i = 1; i <= 4; i++) {
      if (total >= currentPage + i) {
        arr.push(currentPage + i);
      } else {
        continue;
      }
    }
  }

  return arr;
};

export const detectTokenErr = (code) => {
  if (
    code === 1000 ||
    code === 1001 ||
    code === 1002 ||
    code === 1003 ||
    code === 9000 ||
    code === 9001
  ) {
    return true;
  }
  return false;
};

// export const storeStamp = async ({ logUserOut, body }) => {
//   if (!body) return;
//   if (!localStorage.token) {
//     logUserOut();
//     return;
//   }

//   const config = {
//     headers: {
//       Authorization: `Bearer ${localStorage.token}`,
//     },
//   };

//   try {
//     const res = await apiClient.post(mainPaths["stamp"].post, body, config);
//     console.log("body ::", body);
//     console.log("res ::", res);
//   } catch (err) {
//     console.log("err :::");
//     console.log(err);
//     if (err.response && err.response.error) {
//       const code = err.response.error.code;
//       if (detectTokenError(code)) {
//         logUserOut();
//         return;
//       }
//     }
//   }
// };

export const isEmpty = (str) => {
  if (
    str === null ||
    str === undefined ||
    str === "null" ||
    str === "undefined"
  )
    return true;
  return false;
};

export const handleDirect = (path, history) => {
  history.push(path);
};

export const isNowBetween = (current, { start, end }) => {
  const now = current || Date.now();
  return Date.parse(start) <= now && now < Date.parse(end);
};

export const isOpentime = (obj) => {
  const { open_datetime, close_datetime } = obj;
  const startDate = moment.utc(open_datetime).format();
  const endDate = moment.utc(close_datetime).format();
  const isTrue = moment.utc().isBetween(startDate, endDate);
  // console.log("now ", moment.utc().format());
  // console.log("open_datetime ::", open_datetime);
  // console.log("startDate ::", startDate);
  // console.log("endDate ::", endDate);
  return isTrue;
};

export const getCurrentItem = (list) => {
  if (!list) return;
  if (!list.length) return;

  return list.find((item) => {
    const isTrue = isOpentime(item);
    if (isTrue) return item;
  });
  // returns object or undefined
};

export const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const sendTimeStamp = async (data, path) => {
  console.log(" res data  ::", data);

  try {
    const res = await apiClient.post(path, data);
    // console.log(" res send time stamp ::", res);
  } catch (error) {
    console.error("setTimeStamp error :", error.response);
  }
};

export const getParticipants = async (boothInfo) => {
  const appId = getParameterByName("appid", boothInfo.meeting_url);
  const server = getParameterByName("server", boothInfo.meeting_url);
  if (appId && server) {
    return apiClient.get(
      `https://videoroom-server.salin.co.kr/roominfo/${appId}/${server}/${boothInfo.idx}`
    );
  }
  return;
};
