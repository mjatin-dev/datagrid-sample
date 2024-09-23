/* eslint-disable import/no-anonymous-default-export */
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import axios from "axios";
import api from "../../../apiServices";

const loginAccount = (payload) =>
  axios.post(`${BACKEND_BASE_URL}compliance.api.Login`, payload);
const updatePassword = (payload) =>
  api.post("compliance.api.resetPassword", payload);
const setToken = (payload) =>
  api.post("compliance.api.setFCMToken", payload);
const removeFCMToken = (payload) =>
  api.post("compliance.api.removeFCMToken", payload);

const getUserRolesAPI = () => api.get("compliance.api.getUserRoles");

export default {
  loginAccount,
  updatePassword,
  setToken,
  getUserRolesAPI,
  removeFCMToken,
};
