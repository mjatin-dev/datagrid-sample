/* eslint-disable import/no-anonymous-default-export */
import axiosInstance from "../../../../../apiServices";
import api from "../../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../../apiServices/baseurl";

const getTaskReport = (payload) =>
  api.get("compliance.api.GetTaskList", payload);

const getTaskReportByID = (payload) =>
  api.post("compliance.api.getSingleTaskDetail", payload);
const getTaskReferencesByName = (payload) =>
  api.post("compliance.api.GetTaskReferences", payload);
const getUsersByRole = (params) =>
  api.get("compliance.api.getUserList", {
    params: {
      ...(params && { ...params }),
      isFromAssignPage: true,
    },
  });

const getTaskComments = (payload) =>
  api.post("compliance.api.GetTaskComments", payload);

const postTaskComments = (payload) => api.post("compliance.api.SetTaskComments", payload);
const postBulkTaskComments = (payload) => api.post("compliance.api.SetBulkTaskComments", payload);
const getTaskFiles = (payload) =>
  api.post("compliance.api.GetExistingFileNames", payload);
const postUploadFile = ({ taskid, fileData, userId, ftype }) =>
  api.post(
    `/api/UploadFile?Taskid=${taskid}&Userid=${userId}&ftype=${ftype}`,
    fileData,
    {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
  );
// const postUploadFile = (payload) =>
//   api.post(`/api/UploadFile?Taskid=${payload.TaskId}`);

const postAssignTask = (payload) => api.post("compliance.api.AssignTasks", payload);

const changeBulkTaskAsign = (payload) => api.post("compliance.api.bulkAssignTasks", payload);
const changeBulkMarkCompleteAsign = (payload) => api.post("compliance.api.setBulkTaskStatus", payload);

const changeTaskStatus = (payload) =>
  api.post("compliance.api.setTaskStatus", payload);
const getAvailabilityCheck = (payload) =>
  api.post("compliance.api.getUserDetails", payload);

const postCodetailsInsUpdDel = (payload) =>
  api.post("compliance.api.setUserDetails", payload);

const GetEntityLicenseTask = (payload) =>
  api.post("api/GetEntityLicenseTask", payload);

const GetCOCompanyType = () =>
  axiosInstance.get(`${BACKEND_BASE_URL}compliance.api.getCompanyDetails`);

const insertCerificateDetailsArray = (payload) =>
  api.post("compliance.api.setSingleCompanyDetails", payload);

const getAllNotifications = () => api.get("compliance.api.getNotifications");

const coSettingCommonApi = (payload) =>
  api.post("compliance.api.deactivateCompany", payload);

const migrateTasks = (payload) => api.post("api/Migrate", payload);
const getTeamMembers = (payload) =>
  axiosInstance.post(
    `${BACKEND_BASE_URL}compliance.api.getUserByRole`,
    payload
  );
const getCompanyUsers = (payload) =>
  api.post("compliance.api.getCompanyUsers", payload);

const generateOtp = (payload) =>
  api.post("compliance.api.generateOtp", payload);

const getTaskReferencesData = (task_name) =>
  axiosInstance.post("compliance.api.getTaskReference", { task_name });
const setTaskReferenceText = (payload) =>
  axiosInstance.post("compliance.api.setTaskReference", payload);
const setTaskReferenceFiles = (formData) =>
  axiosInstance.post("compliance.api.uploadTaskReferenceFiles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const getFileContent = (file_id) =>
  axiosInstance.post("compliance.api.GetFileContent", { file_id });
const deleteFile = (file_id) =>
  axiosInstance.post("compliance.api.DeleteFile", { file_id });
export default {
  getTaskReport,
  getTaskReportByID,
  getUsersByRole,
  getTaskComments,
  postTaskComments,
  postBulkTaskComments,
  getTaskFiles,
  postUploadFile,
  postAssignTask,
  changeBulkTaskAsign,
  changeBulkMarkCompleteAsign,
  getAvailabilityCheck,
  postCodetailsInsUpdDel,
  GetEntityLicenseTask,
  GetCOCompanyType,
  insertCerificateDetailsArray,
  getAllNotifications,
  coSettingCommonApi,
  migrateTasks,
  getTeamMembers,
  getTaskReferencesByName,
  changeTaskStatus,
  getCompanyUsers,
  generateOtp,

  // Task References Section
  getTaskReferencesData,
  setTaskReferenceText,
  setTaskReferenceFiles,

  // Files
  getFileContent,
  deleteFile,
};
