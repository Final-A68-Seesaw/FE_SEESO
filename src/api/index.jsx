import axios from "axios";
import { cookies } from "../shared/cookie";

const targetServer = 'https://www.walbu.shop'

export const instance = axios.create({
  baseURL: targetServer,
  headers: {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json,",
  },
});

// 토큰이 필요없는 요청에 쓰일 인스턴스 (로그인, 회원가입)
export const nonTokenInstance = axios.create({
  baseURL: targetServer,
  headers: {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json,",
  },
});

// formdata 
export const formDatas = axios.create({
  baseURL: targetServer,
  headers: {
    "content-type": "multipart/form-data",
    accept: "multipart/form-data",
  },
});

instance.interceptors.request.use((config) => {
  const accessToken = cookies.get("accessToken");
  config.headers.common["Authorization"] = `Bearer ${accessToken}`; //Authorization
  return config;
});

formDatas.interceptors.request.use((config) => {
  const accessToken = cookies.get("accessToken");
  config.headers.common["Authorization"] = `Bearer ${accessToken}`; //Authorization
  return config;
});

nonTokenInstance.interceptors.request.use((config) => {
  const accessToken = cookies.get("accessToken");
  config.headers.common["Authorization"] = `Bearer ${accessToken}`; //Authorization
  return config;
});

// Refresh Token 발급 로직
let isTokenRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.map((callback, idx) => {
    // console.log(idx + "번째 재요청 완료");
    return callback(accessToken);
  });
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

instance.interceptors.response.use(
  (config) => {
    // 오류 없을 때
    return config;
  },

  async (error) => {
    // console.log('token err');
    const { config, response } = error;
    const { status } = response;
    const originalReq = config; // 에러가 난 요청정보들

    if (status === 401 || status === 500) {
      // 토큰이 없고,
      if (!isTokenRefreshing) {
        // 토큰 생성중이면, if 실행되지 않도록
        isTokenRefreshing = true; // false 일때는 true로 바꿔주고.
        const refreshToken = cookies.get("refreshToken"); // 리프레시 토큰을 쿠키에서 가져와서

        const newAccessToken = await axios.post(`${targetServer}/user/refresh`, {
          refreshToken,
        });

        const newToken = (newAccessToken.headers.authorization.split(' ')[1])

        cookies.set("accessToken", newToken, {
          path: "/",
          maxAge: 86400, // 
        }); // 쿠키에 다시 저장

        // console.log("토큰 재생성 완료!"); // 토큰 생성이 완료되면
        isTokenRefreshing = false; // 토큰 생성중 상태를 fasle로 바꿔주고

        // 헤더를 새로운 액세스토큰으로 헤더 재설정
        axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalReq.headers.Authorization = `Bearer ${newToken}`;

        onTokenRefreshed(newToken); // 첫 요청이 아닌 다른 쌓여있던 요청 다시 요청보내기
        refreshSubscribers = []; // 요청 배열 초기화
        // console.log("첫 요청도 다시 요청!");
        return axios(originalReq); // 첫 요청 다시 요청
      }
      // 토큰을 생성중일때  (if문을 passing 한 요청들은 )
      const retryOriginalRequest = new Promise((resolve) => {
        addRefreshSubscriber((accessToken) => {
          originalReq.headers.Authorization = "Bearer " + accessToken;
          resolve(axios(originalReq));
        });
      });
      return retryOriginalRequest; // 모아둔 요청 재실행
    }
    return Promise.reject(error);
  })