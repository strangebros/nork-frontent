import axios, { HttpStatusCode } from "axios";
import { httpStatusCode } from "./http-status";
import { jwtDecode } from "jwt-decode";

const { VITE_BACKEND_URL } = import.meta.env;

// local vue api axios instance
function norkAxios(path) {
  const instance = axios.create({
    baseURL: `${VITE_BACKEND_URL}${path}`,
  });

  // request default settings
  instance.defaults.headers.common["Authorization"] = "";
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  // request interceptor
  instance.interceptors.request.use(
    (config) => {
      // token refresh 필요 여부 확인
      let auth = JSON.parse(localStorage.getItem("auth"));
      let member = auth.member;

      if (member != null) {
        if (member.exp < Date.now() / 1000 + 10 * 60) {
          axios
            .post(
              `${VITE_BACKEND_URL}/members/refresh-token`,
              {
                accessToken: auth.accessToken,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.accessToken}`,
                },
              }
            )
            .then((response) => {
              // token refresh 성공
              // 새로운 accessToken 저장
              let data = response.data["data"];
              localStorage.setItem(
                "auth",
                JSON.stringify({
                  accessToken: data["accessToken"],
                  member: jwtDecode(data["accessToken"]),
                })
              );
            })
            .catch((error) => {
              // token refresh 실패
              // 로그인 해제
              localStorage.setItem(
                "auth",
                JSON.stringify({
                  accessToken: null,
                  member: null,
                })
              );
              console.log(error);
              console.log("token refresh에 실패했습니다.");
            });
        }

        if (auth.accessToken != null) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      let status = error.response.status;
      let message = error.response.message;

      console.log(`예외 발생. 코드:${status}, message:${message}`);
      return Promise.reject(error);
    }
  );
  return instance;
}

export { norkAxios };
