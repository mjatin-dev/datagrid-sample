import axios from "axios";
import { BACKEND_BASE_URL } from "../../apiServices/baseurl";

const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("basicToken");
    if (auth) {
      config.headers = {
        Authorization: `Bearer ${auth}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Promise.reject(error);
  }
);
export default axiosInstance;
