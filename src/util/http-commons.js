import axios from "axios";
import { httpStatusCode } from "./http-status";

const { BACKEND_URL } = import.meta.env;

// local vue api axios instance
function norkAxios(path) {
  const instance = axios.create({
    baseURL: `${BACKEND_URL}${path}`,
  });

  // request default settings
  instance.defaults.headers.common["Authorization"] = "";
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  // request interceptor
  instance.interceptors.request.use(
    (config) => {
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
      const {
        config,
        response: { status },
      } = error;

      return Promise.reject(error);
    }
  );
  return instance;
}

export { norkAxios };
