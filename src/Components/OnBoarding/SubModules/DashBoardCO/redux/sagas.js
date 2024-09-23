import { call, put, select, takeLatest } from "redux-saga/effects";
import { actions, types } from "./actions";
import api from "../api";
import { toast } from "react-toastify";
import { actions as authActions } from "Components/Authectication/redux/actions";

import { actions as CoIndustryAction } from "../../../redux/actions";
import {
  fetchAnalyticsTasksRequest,
  fetchDashboardAnalyticsRequest,
  fetchDashboardTeamAnalyticsRequest,
  fetchTaskDetailRequest,
  fetchTasksByTeamPerformanceUserRequest,
  // fetchTasksRequest,
} from "SharedComponents/Dashboard/redux/actions";
import { setCompanyExists } from "SharedComponents/CompanyReducer/actions";
import { DASHBOARD_SEARCH_KEY } from "CommonModules/sharedComponents/constants/constant";

const taskReportRequest = function* taskReportRequest() {
  try {
    const { data, status } = yield call(api.getTaskReport);
    const responseStatus = data.message.status_response;
    if (status === 200 && responseStatus === "Success") {
      yield put(
        actions.taskReportRequestSuccess({
          taskReport: data.message.task_details,
        })
      );
    } else {
      yield put(actions.taskReportRequestFailed({ taskReport: [] }));
    }
  } catch (err) {
    yield put(actions.taskReportRequestFailed({ taskReport: [] }));
  }
};

const taskReportRequestById = function* taskReportRequestById({ payload }) {
  try {
    const { data, status } = yield call(api.getTaskReportByID, payload);
    if (
      status === 200 &&
      data.message &&
      data.message.status_response === "Success"
    ) {
      yield put(
        actions.taskReportByIdRequestSuccess({
          taskReportById: data.message.task_details[0],
        })
      );
    } else {
      yield put(actions.taskReportByIdRequestFailed({ taskReportById: {} }));
    }
  } catch (err) {
    yield put(actions.taskReportByIdRequestFailed({ taskReportById: {} }));
  }
};

const taskReferencesByName = function* taskReferencesByName({ payload }) {
  try {
    const { data, status } = yield call(api.getTaskReferencesByName, payload);
    if (status === 200 && data.message && data.message.status === true) {
      const { task_references } = data.message;
      yield put(
        actions.taskReferensesByNameSuccess({ taskReferences: task_references })
      );
    } else {
      yield put(actions.taskReferensesByNameFailed({ taskReferences: [] }));
    }
  } catch (error) {
    yield put(actions.taskReferensesByNameFailed({ taskReferences: [] }));
  }
};
const userRequestByRole = function* userRequestByRole({ payload }) {
  try {
    const { data, status } = yield call(api.getUsersByRole, payload);

    if (status === 200 && data && data.message && data.message.length !== 0) {
      yield put(
        actions.userByRoleRequestSuccess({
          getUserByRole: data?.message,
        })
      );
    } else {
      yield put(actions.userByRoleRequestFailed({ getUserByRole: {} }));
    }
  } catch (err) {
    yield put(actions.userByRoleRequestFailed({ getUserByRole: {} }));
  }
};

const taskCommentBytaskID = function* taskCommentBytaskID({ payload }) {
  try {
    const { data, status } = yield call(api.getTaskComments, payload);
    if (status === 200 && data.message && data.message.status === true) {
      const { comment_list } = data?.message;
      yield put(actions.taskCommentsByTaskIdSuccess(comment_list));
    } else {
      // toast.success(data && data.Message);
      yield put(actions.taskCommentsByTaskIdFailed());
    }
  } catch (err) {
    yield put(actions.taskCommentsByTaskIdFailed());
  }
};

const postCommentBytaskID = function* postCommentBytaskID({ payload }) {
  try {
    const { data, status } = yield call(api.postTaskComments, payload);
    if (status === 200 && data.message && data.message.status === true) {
      yield put(
        actions.postTaskCommentByTaskIDSuccess({ postTaskCommentById: true })
      );
      yield put(
        actions.taskCommentsByTaskIdRequest({
          task_name: payload.task_name,
        })
      );
      // if (payload.link === 0) {
      //   yield put(
      //     actions.taskCommentsByTaskIdRequest({
      //       taskid: payload.taskID,
      //       link: 0,
      //     })
      //   );
      // }
      // if (payload.link === 1) {
      //   yield put(
      //     actions.taskCommentsByTaskIdRequest({
      //       taskid: payload.taskID,
      //       link: 1,
      //     })
      //   );
      // }
    } else {
      toast.success(data && data.Message);
      yield put(
        actions.postTaskCommentByTaskIDFailed({ postTaskCommentById: {} })
      );
    }
  } catch (err) {
    yield put(
      actions.postTaskCommentByTaskIDFailed({ postTaskCommentById: {} })
    );
  }
};

const postBulkCommentBytaskID = function* postBulkCommentBytaskID({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(api.postBulkTaskComments, payload);
    if (status === 200 && data.message && data.message.status === true) {
      toast.success("Comments added successfully.");
      yield put(
        actions.postBulkTaskCommentByTaskIDSuccess({
          postTaskCommentById: true,
        })
      );
      yield put(actions.setLoader(false));
      // yield put(actions.taskCommentsByTaskIdRequest({task_name: payload.task_name,}));
    } else {
      toast.error(data && data.Message);
      yield put(
        actions.postTaskCommentByTaskIDFailed({ postTaskCommentById: {} })
      );
      yield put(actions.setLoader(false));
    }
  } catch (err) {
    yield put(actions.setLoader(false));
    yield put(
      actions.postTaskCommentByTaskIDFailed({ postTaskCommentById: {} })
    );
  }
};
const getTaskFilesById = function* getTaskFilesById({ payload }) {
  try {
    const { data, status } = yield call(api.getTaskFiles, payload);
    if (status === 200 && data.message && data.message.status === true) {
      if (payload.is_references === 0) {
        yield put(actions.getTaskFilesByIdSucess(data.message.file_details));
      }
    } else {
      yield put(actions.getTaskFilesByIdFailed());
    }
  } catch (error) {
    yield put(actions.getTaskFilesByIdFailed());
  }
};
const postUploadFileById = function* postUploadFileById({ payload }) {
  // debugger
  try {
    if (payload?.taskid) {
      const { data, status } = yield call(api.postUploadFile, payload);
      if (status === 201) {
        yield put(actions.postUploadFileByIDSuccess({ postUploadFile: data }));
        toast.success("Attachement successfully added!");
      } else {
        toast.success(data && data.Message);
        yield put(actions.postUploadFileByIDFailed({ postUploadFile: {} }));
      }
    }
  } catch (err) {
    yield put(actions.postUploadFileByIDFailed({ postUploadFile: {} }));
  }
};

const postAssignTask = function* postAssignTask({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(api.postAssignTask, payload);
    if (status === 200 && data.message.status_response === "Success") {
      toast.success("Task Assigned Successfully!");
      yield put(fetchTaskDetailRequest(payload.task_details[0].name));
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());
      }
      yield put(actions.taskAssignByTaskIDSuccess({ postAssignTask: data }));
      yield put(actions.setLoader(false));
    } else if (data && data.message && data.message) {
      toast.error(
        data.message.status_response ||
          "Something went worng. Please try again."
      );
      yield put(actions.setLoader(false));
      yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } catch (err) {
    toast.error("Something went wrong. Please try again.");
    yield put(actions.setLoader(false));
    yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
  }
};

const changeBulkTaskAsign = function* changeBulkTaskAsign({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(api.changeBulkTaskAsign, payload);
    if (status === 200 && data.message.status_response === "Success") {
      toast.success("Task Assigned Successfully!");
      // yield put(fetchTaskDetailRequest(payload.task_details[0].name));
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      const teamPerformanceUser = yield select(
        (state) => state?.adminMenu?.teamPerformanceUser?.user_id
      );
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());

        const takeActionActiveTab = yield select(
          (state) => state?.adminMenu?.takeActionActiveTab
        );
        const currentAnalyticsKey = takeActionActiveTab?.key;
        const searchQuery = localStorage.getItem(DASHBOARD_SEARCH_KEY) || "";
        const sendPayload = {
          key: teamPerformanceUser
            ? teamPerformanceUser
            : currentAnalyticsKey || "",
          filter: teamPerformanceUser
            ? "Team"
            : takeActionActiveTab.filter === "completedTask"
            ? "completed"
            : takeActionActiveTab.filter,
          search: searchQuery ? searchQuery : "",
          ...{ offset: 0, limit: 2000 },
        };
        if (teamPerformanceUser) {
          yield put(fetchTasksByTeamPerformanceUserRequest(sendPayload));
        } else {
          yield put(fetchAnalyticsTasksRequest(sendPayload));
        }
        // fetchAnalyticsTasks
      }
      yield put(actions.taskAssignByTaskIDSuccess({ postAssignTask: data }));
      yield put(actions.setLoader(false));
    } else if (data && data.message && data.message) {
      toast.error(
        data.message.status_response ||
          "Something went worng. Please try again."
      );
      yield put(actions.setLoader(false));
      yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong. Please try again. Here we are");
    yield put(actions.setLoader(false));
    yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
  }
};

const changeBulkMarkCompleteAsign = function* changeBulkMarkCompleteAsign({
  payload,
}) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(
      api.changeBulkMarkCompleteAsign,
      payload
    );
    const currentAdminMenu = yield select(
      (state) => state.adminMenu.currentMenu
    );
    const teamPerformanceUser = yield select(
      (state) => state?.adminMenu?.teamPerformanceUser?.user_id
    );

    // console.warn('00000000000000000000000 mark Completed Called ----------------------',data);
    if (
      status === 200 &&
      data.message.status_response === "Task Status has been Updated"
    ) {
      // if (payload.status === "Approval Pending") {
      //   toast.success(`Selected Task completed successfully!`);
      // } else {
      //   toast.success(`Selected Task ${payload.status} successfully!`);
      // }
      // console.log(payload.task_details[0]?.status)
      let status = payload.task_details[0]?.status;
      status = status === "rejected" ? status : "completed";
      toast.success(`Selected Task ${status} successfully!`);
      // yield put(fetchTaskDetailRequest(payload.task_details[0].name));

      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());

        const takeActionActiveTab = yield select(
          (state) => state?.adminMenu?.takeActionActiveTab
        );
        const currentAnalyticsKey = takeActionActiveTab?.key;
        const searchQuery = localStorage.getItem(DASHBOARD_SEARCH_KEY) || "";
        const sendPayload = {
          key: teamPerformanceUser
            ? teamPerformanceUser
            : currentAnalyticsKey || "",
          filter: teamPerformanceUser
            ? "Team"
            : takeActionActiveTab.filter === "completedTask"
            ? "completed"
            : takeActionActiveTab.filter,
          search: searchQuery ? searchQuery : "",
          ...{ offset: 0, limit: 2000 },
        };
        if (teamPerformanceUser) {
          yield put(fetchTasksByTeamPerformanceUserRequest(sendPayload));
        }
      }
      yield put(actions.taskAssignByTaskIDSuccess({ postAssignTask: data }));
      yield put(actions.setLoader(false));
    } else if (data && data.message && data.message) {
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());

        const takeActionActiveTab = yield select(
          (state) => state?.adminMenu?.takeActionActiveTab
        );
        const currentAnalyticsKey = takeActionActiveTab?.key;
        const searchQuery = localStorage.getItem(DASHBOARD_SEARCH_KEY) || "";
        const sendPayload = {
          key: currentAnalyticsKey || "",
          filter:
            takeActionActiveTab.filter === "completedTask"
              ? "completed"
              : takeActionActiveTab.filter,
          search: searchQuery ? searchQuery : "",
          ...{ offset: 0, limit: 2000 },
        };
        yield put(fetchAnalyticsTasksRequest(sendPayload));
      }
      toast.success(
        data.message.status_response ||
          "Something went worng. Please try again."
      );
      yield put(actions.setLoader(false));
      yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.warn(err);
    toast.error("Something went wrong. Please try again.");
    yield put(actions.setLoader(false));
    yield put(actions.taskAssignByTaskIDFailed({ postAssignTask: {} }));
  }
};

const changeTaskStatus = function* changeTaskStatus({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(api.changeTaskStatus, {
      task_name: payload.task_name,
      status: payload.status,
    });
    if (status === 200 && data.message.status === true) {
      if (payload.status === "Approval Pending") {
        toast.success(`Task completed successfully!`);
      } else {
        toast.success(`Task ${payload.status} successfully!`);
      }
      if (payload.content) {
        yield put(
          actions.postTaskCommentByTaskID({
            task_name: payload.task_name,
            content: payload.content,
            reason: "Rejected",
          })
        );
      }
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());
      }
      yield put(actions.changeTaskStatusSuccess({ changeTaskStatus: true }));
      yield put(fetchTaskDetailRequest(payload.task_name));
      yield put(actions.setLoader(false));
    } else {
      toast.error(
        data?.message?.status_response || "Unable to update task status"
      );
      yield put(actions.setLoader(false));
      yield put(actions.changeTaskStatusFailed({ changeTaskStatus: false }));
    }
  } catch (err) {
    yield put(actions.setLoader(false));
    toast.error("Something went wrong. Please try again");
    yield put(actions.changeTaskStatusFailed({ changeTaskStatus: false }));
  }
};

const changeBulkTaskStatus = function* changeBulkTaskStatus({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data, status } = yield call(api.changeTaskStatus, {
      task_name: payload.task_name,
      status: payload.status,
    });
    if (status === 200 && data.message.status === true) {
      if (payload.status === "Approval Pending") {
        toast.success(`Selected Task completed successfully!`);
      } else {
        toast.success(`Selected Task ${payload.status} successfully!`);
      }
      if (payload.content) {
        yield put(
          actions.postTaskCommentByTaskID({
            task_name: payload.task_name,
            content: payload.content,
            reason: "Rejected",
          })
        );
      }
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());
      }
      yield put(
        actions.changeBulkTaskStatusSuccess({ changeTaskStatus: true })
      );
      // yield put(fetchTaskDetailRequest(payload.task_name));
      yield put(actions.setLoader(false));
    } else {
      toast.error(
        data?.message?.status_response || "Unable to update task status"
      );
      yield put(actions.setLoader(false));
      yield put(
        actions.changeBulkTaskStatusFailed({ changeTaskStatus: false })
      );
    }
  } catch (err) {
    yield put(actions.setLoader(false));
    toast.error("Something went wrong. Please try again");
    yield put(actions.changeBulkTaskStatusFailed({ changeTaskStatus: false }));
  }
};

const userAvailabilityCheck = function* userAvailabilityCheck({ payload }) {
  try {
    const { data, status } = yield call(api.getAvailabilityCheck, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      yield put(
        actions.availabilityCheckRequestSuccess({
          availabilityInfo: data.message.user_details,
        })
      );
    } else {
      yield put(
        actions.availabilityCheckRequestFailed({ availabilityInfo: {} })
      );
    }
  } catch (err) {
    yield put(actions.availabilityCheckRequestFailed({ availabilityInfo: {} }));
  }
};

const coDetailsInsUpdDelInfo = function* coDetailsInsUpdDelInfo({ payload }) {
  try {
    const { data, status } = yield call(api.postCodetailsInsUpdDel, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      if (payload.userType === 1) {
        toast.success("Details Changed Successfully!");
        yield put(authActions.updateUserName(payload?.full_name));
        yield put(
          actions.availabilityCheckequest({
            loginID: payload.adminEmail,
            loginty: "AdminEmail",
          })
        );
      } else if (payload.userType === 9) {
        toast.success("Verification link sent to you given email");
      }

      yield put(
        actions.coDetailsInsUpdDelRequestSuccess({
          insUpdDelstatus: "Success",
          data: data,
        })
      );
    } else {
      toast.error("Something went wrong.");
      yield put(
        actions.coDetailsInsUpdDelRequestFailed({ insUpdDelstatus: "Failed" })
      );
    }
  } catch (err) {
    toast.error("Something went wrong.");
    yield put(
      actions.coDetailsInsUpdDelRequestFailed({ insUpdDelstatus: "Failed" })
    );
  }
};

const getCoEntityLicenseTask = function* getCoEntityLicenseTask({ payload }) {
  try {
    const { data, status } = yield call(api.GetEntityLicenseTask, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      yield put(
        actions.getEntityLicenseTaskRequestSuccess({ entityLicenseInfo: data })
      );
    } else {
      yield put(
        actions.getEntityLicenseTaskRequestFailed({ entityLicenseInfo: {} })
      );
    }
  } catch (err) {
    yield put(
      actions.getEntityLicenseTaskRequestFailed({ entityLicenseInfo: {} })
    );
  }
};

const getCOCompnayType = function* getCOCompnayType({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data } = yield call(api.GetCOCompanyType, payload);
    const { message } = data;
    if (message.status) {
      yield put(
        actions.getCompanyTypeRequestSuccess({
          CompanyInfo: message.company_details_list,
        })
      );
      yield put(actions.setLoader(false));
      yield put(CoIndustryAction.companyTypeRequest());
    } else {
      yield put(actions.setLoader(false));

      yield put(actions.getCompanyTypeRequestFailed({ CompanyInfo: {} }));
    }
  } catch (err) {
    yield put(actions.setLoader(false));

    yield put(actions.getCompanyTypeRequestFailed({ CompanyInfo: {} }));
  }
};

const insertCerificateDetailsRequest =
  function* insertCerificateDetailsRequest({ payload }) {
    try {
      yield put(actions.setLoader(true));
      const { data } = yield call(api.insertCerificateDetailsArray, payload);
      if (data.message.status) {
        toast.success(
          `Company ${
            payload.company_docname ? "updated" : "added"
          } Successfully`
        );
        yield put(
          actions.insCertificateDetailsRequestSuccess({ Status: "Success" })
        );
        yield put(setCompanyExists(true));
        yield put(actions.setLoader(false));

        yield put(actions.getCompanyTypeRequest());
      } else {
        toast.error(data.message.status_response);
        yield put(
          actions.insCertificateDetailsRequestFailed({ Status: "Failed" })
        );
        yield put(actions.setLoader(false));
      }
    } catch (err) {
      // toast.error("Something went wrong.");
      yield put(
        actions.insCertificateDetailsRequestFailed({ Status: "Failed" })
      );
      yield put(actions.setLoader(false));
    }
  };

const getCoNotifications = function* getCoNotifications({ payload }) {
  try {
    const { data, status } = yield call(api.getAllNotifications);
    if (status === 200 && data.message && data.message?.length !== 0) {
      yield put(
        actions.getCoNotificationsRequestSuccess({
          notifications: data.message,
        })
      );
    } else {
      yield put(actions.getCoNotificationsRequestFailed({ notifications: {} }));
    }
  } catch (err) {
    yield put(actions.getCoNotificationsRequestFailed({ notifications: {} }));
  }
};

const getCoAccountSetting = function* getCoAccountSetting({ payload }) {
  try {
    const { data, status } = yield call(api.coSettingCommonApi, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      yield put(actions.getCoAccountRequestSuccess({ coAccount: data }));
    } else {
      yield put(actions.getCoAccountRequestFailed({ coAccount: {} }));
    }
  } catch (err) {
    yield put(actions.getCoAccountRequestFailed({ coAccount: {} }));
  }
};

const getPaymentDetail = function* getPaymentDetail({ payload }) {
  try {
    const { data, status } = yield call(api.coSettingCommonApi, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      yield put(actions.getPaymentSuccess({ coAccount: data }));
    } else {
      yield put(actions.getPaymentFailed({ coAccount: {} }));
    }
  } catch (err) {
    yield put(actions.getPaymentFailed({ coAccount: {} }));
  }
};

const getCoAccountLicenses = function* getCoAccountLicenses({ payload }) {
  try {
    const { data, status } = yield call(api.coSettingCommonApi, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      yield put(
        actions.getCoAccountLicensesRequestSuccess({ coLicenses: data })
      );
    } else {
      yield put(actions.getCoAccountLicensesRequestFailed({ coLicenses: {} }));
    }
  } catch (err) {
    yield put(actions.getCoAccountLicensesRequestFailed({ coLicenses: {} }));
  }
};

const coAccountUpdate = function* coAccountUpdate({ payload }) {
  try {
    const { data, status } = yield call(api.coSettingCommonApi, payload);
    let statusCode = data && data[0] && data[0].StatusCode;
    if (status === 200 && statusCode !== false) {
      toast.success("Setting saved successfully.");
      yield put(actions.coAccountUpdateRequestSuccess({ Status: "Success" }));
    } else {
      toast.error("Something went wrong.");
      yield put(actions.coAccountUpdateRequestFailed({ Status: "Failed" }));
    }
  } catch (err) {
    toast.error("Something went wrong.");
    yield put(actions.coAccountUpdateRequestFailed({ Status: "Failed" }));
  }
};

const CompanyDeleteRequest = function* CompanyDeleteRequest({ payload }) {
  try {
    yield put(actions.setLoader(true));
    const { data } = yield call(api.coSettingCommonApi, payload);
    if (data.message.status) {
      toast.success("Company deleted successfully.");

      yield put(actions.deleteCompanyRequestSuccess({ Status: "Success" }));
      yield put(actions.setLoader(false));
      yield put(actions.getCompanyTypeRequest());
    } else {
      toast.error(data.message.status_response);
      yield put(actions.deleteCompanyRequestFailed({ Status: "Failed" }));
      yield put(actions.setLoader(false));
    }
  } catch (err) {
    toast.error("Something went wrong.");
    yield put(actions.deleteCompanyRequestFailed({ Status: "Failed" }));
    yield put(actions.setLoader(false));
  }
};

const generateOtpRequestSaga = function* generateOtpRequest({ payload }) {
  try {
    const { data, status } = yield call(api.generateOtp, payload);
    if (status === 200 && data && data?.message?.status) {
      toast.success("OTP has been sent to your registered mobile number");
    } else {
      toast.error(data?.message?.status_response || "something went wrong");
    }
  } catch (error) {
    toast.error("Something went wrong.");
  }
};

export default function* sagas() {
  yield takeLatest(types.TASK_REPORT_REQUEST, taskReportRequest);
  yield takeLatest(types.GET_TASK_REPORT_BY_ID, taskReportRequestById);
  yield takeLatest(
    types.GET_TASK_REFERENSES_BY_TASK_NAME,
    taskReferencesByName
  );
  yield takeLatest(types.GET_USER_BY_ROLE, userRequestByRole);
  yield takeLatest(types.GET_TASK_COMMENTS_BY_TASK_ID, taskCommentBytaskID);
  yield takeLatest(types.POST_TASK_COMMENT_BY_TASK_ID, postCommentBytaskID);
  yield takeLatest(
    types.POST_BULK_TASK_COMMENT_BY_TASK_ID,
    postBulkCommentBytaskID
  );
  yield takeLatest(types.GET_TASK_FILES_BY_TASK_ID, getTaskFilesById);
  yield takeLatest(types.POST_UPLOAD_FILE_BY_TASK_ID, postUploadFileById);
  yield takeLatest(types.POST_ASSIGN_TASK_BY_TASKID, postAssignTask);
  yield takeLatest(types.CHANGE_TASK_STATUS, changeTaskStatus);
  yield takeLatest(types.CHANGE_BULK_TASK_STATUS, changeBulkTaskStatus);
  yield takeLatest(types.CHANGE_BULK_TASK_ASIGN, changeBulkTaskAsign);
  yield takeLatest(
    types.CHANGE_BULK_TASK_MARK_COMPLETE,
    changeBulkMarkCompleteAsign
  );
  // changeBulkMarkCompleteAsign
  yield takeLatest(types.GET_AVAILABILITY_CHECK, userAvailabilityCheck);
  yield takeLatest(
    types.CO_PERSONAL_DETAILS_INS_UPD_DEL_REQUEST,
    coDetailsInsUpdDelInfo
  );
  yield takeLatest(
    types.GET_ENTITY_LICENSE_TASK_REQUEST,
    getCoEntityLicenseTask
  );
  yield takeLatest(types.GET_COMPANY_TYPE_REQUEST, getCOCompnayType);
  yield takeLatest(
    types.INS_CERTIFICATE_DETAILS_REQUEST,
    insertCerificateDetailsRequest
  );
  yield takeLatest(types.GET_CO_NOTIFICATIONS_REQUEST, getCoNotifications);
  yield takeLatest(types.GET_CO_ACCOUNT_REQUEST, getCoAccountSetting);
  yield takeLatest(types.GET_CO_ACCOUNT_LICENSES_REQUEST, getCoAccountLicenses);
  yield takeLatest(types.CO_ACCOUNT_UPDATE_REQUEST, coAccountUpdate);
  yield takeLatest(types.CO_COMPANY_DELETE_REQUEST, CompanyDeleteRequest);

  yield takeLatest(types.GET_PAYMENT_REQUEST, getPaymentDetail);
  yield takeLatest(
    types.CO_SETTING_GENERATE_OTP_REQUEST,
    generateOtpRequestSaga
  );
}
