import { handleActions } from "redux-actions";
import { types } from "./actions";

const actionHandler = {
  [types.TASK_REPORT_REQUEST]: (state) => ({
    ...state,
    taskReport: {},
  }),
  [types.CURRENT_ACTIVE_MENU]: (state, { payload }) => ({
    ...state,
    currentMenu: payload,
  }),
  [types.DEV_EX_FILTER_DATA]: (state, { payload }) => ({
    ...state,
    devExFilterData: payload,
  }),

  [types.TASK_REPORT_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    taskReport: {},
  }),
  [types.TASK_REPORT_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    taskReport: payload,
  }),

  [types.GET_TASK_REPORT_BY_ID]: (state) => ({
    ...state,
    taskReportById: {},
  }),
  [types.GET_TASK_REPORT_FAILED_BY_ID]: (state, { payload }) => ({
    ...state,
    taskReportById: {},
  }),
  [types.GET_TASK_REPORT_SUCCESS_BY_ID]: (state, { payload }) => ({
    ...state,
    taskReportById: payload,
  }),

  [types.GET_TASK_REFERENSES_BY_TASK_NAME]: (state) => ({
    ...state,
    taskReferences: [],
  }),
  [types.GET_TASK_REFERENSES_BY_TASK_NAME_SUCCESS]: (state, { payload }) => ({
    ...state,
    taskReferences: payload,
  }),
  [types.GET_TASK_REFERENSES_BY_TASK_NAME_FAILED]: (state) => ({
    ...state,
    taskReferences: [],
  }),

  [types.GET_USER_BY_ROLE]: (state) => ({
    ...state,
    getUserByRole: {},
  }),
  [types.GET_USER_FAILED_BY_ROLE]: (state, { payload }) => ({
    ...state,
    getUserByRole: payload,
  }),
  [types.GET_USER_SUCCESS_BY_ROLE]: (state, { payload }) => ({
    ...state,
    getUserByRole: payload,
  }),

  [types.GET_TASK_COMMENTS_BY_TASK_ID]: (state) => ({
    ...state,
    getTaskCommentByRole: {
      isLoading: true,
      comments: [],
    },
  }),
  [types.GET_TASK_COMMENTS_FAILED_BY_TASK_ID]: (state) => ({
    ...state,
    getTaskCommentByRole: {
      isLoading: false,
      comments: state.getTaskCommentByRole.comments || [],
    },
  }),
  [types.GET_TASK_COMMENTS_SUCCESS_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    getTaskCommentByRole: {
      isLoading: false,
      comments: payload || [],
    },
  }),

  [types.POST_TASK_COMMENT_BY_TASK_ID]: (state) => ({
    ...state,
    postTaskCommentById: {},
  }),
  [types.POST_TASK_COMMENTS_FAILED_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postTaskCommentById: {},
  }),
  [types.POST_TASK_COMMENTS_SUCCESS_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postTaskCommentById: payload,
  }),

  [types.POST_BULK_TASK_COMMENT_BY_TASK_ID]: (state) => ({
    ...state,
    postTaskCommentById: {},
  }),
  [types.POST_BULK_TASK_COMMENT_SUCCESS_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postTaskCommentById: {},
  }),
  [types.POST_BULK_TASK_COMMENTS_FAILED_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postTaskCommentById: payload,
  }),



  [types.GET_TASK_FILES_BY_TASK_ID]: (state) => ({
    ...state,
    taskFilesById: {
      isLoading: true,
      files: [],
    },
  }),
  [types.GET_TASK_FILES_FAILED_BY_TASK_ID]: (state) => ({
    ...state,
    taskFilesById: {
      isLoading: false,
      files: state.taskFilesById.files || [],
    },
  }),
  [types.GET_TASK_FILES_SUCESS_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    taskFilesById: {
      isLoading: false,
      files: payload || [],
    },
  }),

  [types.POST_UPLOAD_FILE_BY_TASK_ID]: (state) => ({
    ...state,
    postUploadFile: {},
  }),
  [types.POST_UPLOAD_FILE_FAILED_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postUploadFile: {},
  }),
  [types.POST_UPLOAD_FILE_SUCCESS_BY_TASK_ID]: (state, { payload }) => ({
    ...state,
    postUploadFile: payload,
  }),

  [types.POST_ASSIGN_TASK_BY_TASKID]: (state) => ({
    ...state,
    postAssignTask: {},
  }),
  [types.POST_ASSIGN_TASK_FAILED_BY_TASKID]: (state, { payload }) => ({
    ...state,
    postAssignTask: {},
  }),
  [types.POST_ASSIGN_TASK_SUCCESS_BY_TASKID]: (state, { payload }) => ({
    ...state,
    postAssignTask: payload,
  }),

  [types.CHANGE_TASK_STATUS]: (state) => ({
    ...state,
    changeTaskStatus: null,
  }),
  [types.CHANGE_TASK_STATUS_SUCCESS]: (state, { payload }) => ({
    ...state,
    changeTaskStatus: payload,
  }),
  [types.CHANGE_TASK_STATUS_FAILED]: (state, { payload }) => ({
    ...state,
    changeTaskStatus: payload,
  }),

  [types.CHANGE_BULK_TASK_STATUS]: (state) => ({
    ...state,
    changeBulkTaskStatus: null,
  }),

  [types.CHANGE_BULK_TASK_STATUS_SUCCESS]: (state, { payload }) => ({
    ...state,
    changeBulkTaskStatus: payload,
  }),
  [types.CHANGE_BULK_TASK_STATUS_FAILED]: (state, { payload }) => ({
    ...state,
    changeBulkTaskStatus: payload,
  }),

  // BULK ASIGN TASK APPROVE AND CC
  [types.CHANGE_BULK_TASK_ASIGN]: (state) => ({
    ...state,
    changeBulkTaskAsign: null,
  }),
  
  [types.CHANGE_BULK_TASK_ASIGN_SUCCESS]: (state, { payload }) => ({
    ...state,
    changeBulkTaskAsign: payload,
  }),
  [types.CHANGE_BULK_TASK_ASIGN_FAILED]: (state, { payload }) => ({
    ...state,
    changeBulkTaskAsign: payload,
  }),

  [types.GET_AVAILABILITY_CHECK]: (state) => ({
    ...state,
    loader: true,
    userAvailability: {},
  }),
  [types.GET_AVAILABILITY_CHECK_SUCCESS]: (state, { payload }) => ({
    ...state,
    loader: false,
    userAvailability: payload,
  }),
  [types.GET_AVAILABILITY_CHECK_FAILED]: (state, { payload }) => ({
    ...state,
    loader: false,
    userAvailability: {},
  }),

  [types.CO_PERSONAL_DETAILS_INS_UPD_DEL_REQUEST]: (state) => ({
    ...state,
    coDetailsInsUpdDelInfo: {},
  }),
  [types.CO_PERSONAL_DETAILS_INS_UPD_DEL_REQUEST_SUCCESS]: (
    state,
    { payload }
  ) => ({
    ...state,
    coDetailsInsUpdDelInfo: payload,
  }),
  [types.CO_PERSONAL_DETAILS_INS_UPD_DEL_REQUEST_FAILED]: (
    state,
    { payload }
  ) => ({
    ...state,
    coDetailsInsUpdDelInfo: payload,
  }),

  [types.GET_ENTITY_LICENSE_TASK_REQUEST]: (state) => ({
    ...state,
    coEntityLicenseTask: {},
  }),
  [types.GET_ENTITY_LICENSE_TASK_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    coEntityLicenseTask: payload,
  }),
  [types.GET_ENTITY_LICENSE_TASK_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    coEntityLicenseTask: {},
  }),

  [types.GET_COMPANY_TYPE_REQUEST]: (state) => ({
    ...state,
    companyTypeInfo: {},
  }),
  [types.GET_COMPANY_TYPE_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    companyTypeInfo: payload,
  }),
  [types.GET_COMPANY_TYPE_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    companyTypeInfo: {},
  }),

  [types.INS_CERTIFICATE_DETAILS_REQUEST]: (state) => ({
    ...state,
    CompanyAddEditStatus: {},
  }),
  [types.INS_CERTIFICATE_DETAILS_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    CompanyAddEditStatus: payload,
  }),
  [types.INS_CERTIFICATE_DETAILS_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    CompanyAddEditStatus: payload,
  }),

  [types.GET_CO_NOTIFICATIONS_REQUEST]: (state) => ({
    ...state,
    userNotifications: {},
  }),
  [types.GET_CO_NOTIFICATIONS_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    userNotifications: payload,
  }),
  [types.GET_CO_NOTIFICATIONS_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    userNotifications: {},
  }),

  [types.GET_CO_ACCOUNT_REQUEST]: (state) => ({
    ...state,
    coAccountInfo: {},
  }),
  [types.GET_CO_ACCOUNT_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    coAccountInfo: payload,
  }),
  [types.GET_CO_ACCOUNT_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    coAccountInfo: {},
  }),

  [types.GET_PAYMENT_REQUEST]: (state) => ({
    ...state,
    paymentDetail: {},
  }),
  [types.GET_PAYMENT_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    paymentDetail: payload,
  }),
  [types.GET_PAYMENT_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    paymentDetail: {},
  }),

  [types.GET_CO_ACCOUNT_LICENSES_REQUEST]: (state) => ({
    ...state,
    coAccountLicenses: {},
  }),
  [types.GET_CO_ACCOUNT_LICENSES_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    coAccountLicenses: payload,
  }),
  [types.GET_CO_ACCOUNT_LICENSES_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    coAccountLicenses: {},
  }),

  [types.CO_ACCOUNT_UPDATE_REQUEST]: (state) => ({
    ...state,
    coAccountUpdStatus: {},
  }),
  [types.CO_ACCOUNT_UPDATE_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    coAccountUpdStatus: payload,
  }),
  [types.CO_ACCOUNT_UPDATE_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    coAccountUpdStatus: payload,
  }),

  [types.CO_COMPANY_DELETE_REQUEST]: (state) => ({
    ...state,
    companyDeleteStatus: {
      isLoading: true,
    },
  }),
  [types.CO_COMPANY_DELETE_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    companyDeleteStatus: {
      isLoading: false,
      data: payload,
    },
  }),
  [types.CO_COMPANY_DELETE_REQUEST_FAILED]: (state, { payload }) => ({
    ...state,
    companyDeleteStatus: {
      isLoading: false,
      data: payload,
    },
  }),
  [types.CO_SET_LOADER]: (state, { payload }) => ({
    ...state,
    loader: payload,
  }),
  [types.CO_SIDEBAR_MENU_OPEN_CLOSE]: (state, { payload }) => ({
    ...state,
    sideBarOpenClose: payload,
  }),
};

export default handleActions(actionHandler, {
  currentMenu: "taskList",
  devExFilterData: {

    // subject: [],
    // customerName: [],
    // status:[],
    // licenseDisplay:[],
    // assignedToName:[],
    // frequency:[],
    // dueDate:[],
    // impactFlag:[],
    // riskRating:[],

  },
  taskReport: {},
  taskReportById: {},
  getUserByRole: {},
  getTaskCommentByRole: {
    isLoading: false,
    comments: [],
  },
  postTaskCommentById: {},
  postUploadFile: {},
  postAssignTask: {},
  userAvailability: {},
  coDetailsInsUpdDelInfo: {},
  coEntityLicenseTask: {},
  companyTypeInfo: {},
  CompanyAddEditStatus: {},
  userNotifications: {},
  coAccountInfo: {},
  coAccountLicenses: {},
  coAccountUpdStatus: {},
  companyDeleteStatus: {},
  paymentDetail: {},
  loader: false,
  sideBarOpenClose: false,
  taskFilesById: {
    isLoading: false,
    files: [],
  },
});
