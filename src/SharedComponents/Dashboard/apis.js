/* eslint-disable import/no-anonymous-default-export */
import axiosInstance from "../../apiServices";

const getTasks = (params) =>
  axiosInstance.get("compliance.compliance.apis.task.task", {
    params,
  });

const getTasksPost = (payload) =>
  axiosInstance.post(
    `compliance.compliance.apis.task.task?key=all&filter=Calender&search=&offset=0&limit=100`,
    {
      ...payload,
    }
  );

const getTasksByFilter = (params) =>
  axiosInstance.get("compliance.compliance.apis.task.task", { params });
const getTasksFilters = (params) =>
  axiosInstance.post("compliance.compliance.apis.task.taskWebFilter", params);
const postTasksByFilter = (params) =>
  axiosInstance.post("compliance.compliance.apis.task.task", params);
const getDevExDataListing = (params) =>
  axiosInstance.post("compliance.compliance.apis.task.DevxTaskList", params);
//   axiosInstance.post("compliance.compliance.apis.task.task", {
//   params,
// });

const getTaskDetail = (taskId) =>
  axiosInstance.get("compliance.compliance.apis.task.taskDetail", {
    params: {
      taskId,
    },
  });

const getTasksBySearchQuery = (params) =>
  axiosInstance.get("compliance.compliance.apis.task.taskSearchFilter", {
    params,
  });
const getPaymentPlanStatus = () =>
  axiosInstance.get("compliance.api.getPaymentDetails");

const fetchTaskImpact = (task_name) =>
  axiosInstance.post("compliance.api.getImpactList", {
    task_name,
  });
const setNotApplicableForMe = (payload) =>
  axiosInstance.post("compliance.api.NotApplicableForMe", payload);
const setApplicableForMe = (payload) =>
  axiosInstance.post("compliance.api.ReApplicableTask", payload);

export default {
  getTasks,
  getTasksPost,
  getTasksByFilter,
  getDevExDataListing,
  postTasksByFilter,
  getTasksFilters,
  getTaskDetail,
  getTasksBySearchQuery,
  getPaymentPlanStatus,
  fetchTaskImpact,
  setNotApplicableForMe,
  setApplicableForMe,
};
