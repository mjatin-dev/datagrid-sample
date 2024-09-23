import axios from "axios";
import { createLogoutAction } from "Components/Authectication/redux/actions";
import { store } from "index";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "./baseurl";
import { addCancelToken, removeCancelToken } from "./utils";
const BACKEND_URL = BACKEND_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("basicToken");
    if (auth && config.url !== "compliance.api.signUp") {
      config.headers = {
        Authorization: `Bearer ${auth}`,
      };
    }
    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;
    addCancelToken(cancelToken);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.cancelToken) {
      removeCancelToken(response.config.cancelToken);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response?.status === 401) {
      const state = store.getState();
      const userEmail = state?.auth?.loginInfo?.email;
      if (userEmail) {
        toast.error("Your session has been expired.");
        store.dispatch(createLogoutAction());
      }
    }
    Promise.reject(error);
  }
);
export default axiosInstance;
