import { createAction } from "redux-actions";

const DASHBOARD_ACTIONS = "DASHBOARD_ACTIONS/";
export const SET_CURRENT_VIEW_BY_FILTER =
  DASHBOARD_ACTIONS + "SET_CURRENT_VIEW_BY_FILTER";
export const SET_CURRENT_ACTIVE_TAB =
  DASHBOARD_ACTIONS + "SET_CURRENT_ACTIVE_TAB";
export const FETCH_TASKS_REQUREST = DASHBOARD_ACTIONS + "FETCH_TASKS_REQUREST";
export const FETCH_TASKS_SUCCESS = DASHBOARD_ACTIONS + "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILED = DASHBOARD_ACTIONS + "FETCH_TASKS_FAILED";

export const FETCH_TASKS_BY_FILTER_REQUREST =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_FILTER_REQUREST";
export const FETCH_TASKS_BY_FILTER_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_FILTER_SUCCESS";
export const FETCH_TASKS_BY_FILTER_FAILED =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_FILTER_FAILED";

export const COLLAPS_ALL_TASKS = DASHBOARD_ACTIONS + "COLLAPS_ALL_TASKS";

export const FETCH_TASK_DETAIL_REQUEST =
  DASHBOARD_ACTIONS + "FETCH_TASK_DETAIL_REQUEST";
export const FETCH_TASK_DETAIL_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_TASK_DETAIL_SUCCESS";
export const FETCH_TASK_DETAIL_FAILED =
  DASHBOARD_ACTIONS + "FETCH_TASK_DETAIL_FAILED";
export const CLEAR_TASK_DETAIL = DASHBOARD_ACTIONS + "CLEAR_TASK_DETAIL";

export const SET_CURRENT_DASHBOARD_TAB =
  DASHBOARD_ACTIONS + "SET_CURRENT_DASHBOARD_TAB";

export const FETCH_TASKS_BY_SEARCH_QUERY_REQUEST =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_SEARCH_QUERY_REQUEST";
export const FETCH_TASKS_BY_SEARCH_QUERY_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_SEARCH_QUERY_SUCCESS";
export const FETCH_TASKS_BY_SEARCH_QUERY_FAILED =
  DASHBOARD_ACTIONS + "FETCH_TASKS_BY_SEARCH_QUERY_FAILED";

export const SET_DASHBOARD_SEARCH = DASHBOARD_ACTIONS + "SET_DASHBOARD_SEARCH";
export const CLEAR_DASHBOARD_SEARCH =
  DASHBOARD_ACTIONS + "CLEAR_DASHBOARD_SEARCH";

export const SET_IS_PAYMENT_PLAN_ACTIVE = "SET_IS_PAYMENT_PLAN_ACTIVE";
export const SET_ACTIVE_LICENSES = "SET_ACTIVE_LICENSES";
export const CHECK_PAYMENT_PLANT_STATUS = "CHECK_PAYMENT_PLANT_STATUS";

export const FETCH_ANALYTICS_TASKS_REQUEST =
  DASHBOARD_ACTIONS + "FETCH_ANALYTICS_TASKS_REQUEST";
export const FETCH_ANALYTICS_TASKS_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_ANALYTICS_TASKS_SUCCESS";
export const FETCH_ANALYTICS_TASKS_FAILED =
  DASHBOARD_ACTIONS + "FETCH_ANALYTICS_TASKS_FAILED";
export const CLEAR_ANALYTICS_TASKS =
  DASHBOARD_ACTIONS + "CLEAR_ANALYTICS_TASKS";

export const FETCH_DASHBOARD_ANALYTICS_REQUEST =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_ANALYTICS_REQUEST";
export const FETCH_DASHBOARD_ANALYTICS_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_ANALYTICS_SUCCESS";
export const FETCH_DASHBOARD_ANALYTICS_FAILED =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_ANALYTICS_FAILED";
export const CLEAR_DASHBOARD_ANALYTICS =
  DASHBOARD_ACTIONS + "CLEAR_DASHBOARD_ANALYTICS";

export const FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST";
export const FETCH_DASHBOARD_TEAM_ANALYTICS_SUCCESS =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_TEAM_ANALYTICS_SUCCESS";
export const FETCH_DASHBOARD_TEAM_ANALYTICS_FAILED =
  DASHBOARD_ACTIONS + "FETCH_DASHBOARD_TEAM_ANALYTICS_FAILED";

export const FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST =
  "FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST";
export const FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_SUCCESS =
  "FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_SUCCESS";
export const FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_FAILED =
  "FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_FAILED";
export const CLEAR_TASKS_BY_TEAM_PERFORMANCE =
  "CLEAR_TASKS_BY_TEAM_PERFORMANCE";

export const SET_TASK_DETAIL_COMMENT_MODAL = "SET_TASK_DETAIL_COMMENT_MODAL";
export const SET_TASK_DETAIL_LOG_MODAL = "SET_TASK_DETAIL_LOG_MODAL";
export const SET_TASK_DETAIL_REF_MODAL = "SET_TASK_DETAIL_REF_MODAL";
export const SET_TASK_DETAIL_IMPACT_MODAL = "SET_TASK_DETAIL_IMPACT_MODAL";
export const FETCH_IMPACT_DETAILS_BY_TASK = "FETCH_IMPACT_DETAILS_BY_TASK";
export const SET_IS_REF_EDITED = "SET_IS_REF_EDITED";

export const SET_ADD_IMPACT_MODAL = "SET_ADD_IMPACT_MODAL";

export const SET_NOT_APPLICABLE_REQUEST =
  DASHBOARD_ACTIONS + "SET_NOT_APPLICABLE_REQUEST";
export const SET_NOT_APPLICABLE_SUCCESS =
  DASHBOARD_ACTIONS + "SET_NOT_APPLICABLE_SUCCESS";
export const SET_NOT_APPLICABLE_FAILED =
  DASHBOARD_ACTIONS + "SET_NOT_APPLICABLE_FAILED";
export const SET_APPLICABLE_REQUEST =
  DASHBOARD_ACTIONS + "SET_APPLICABLE_REQUEST";
export const SET_APPLICABLE_SUCCESS =
  DASHBOARD_ACTIONS + "SET_APPLICABLE_SUCCESS";
export const SET_APPLICABLE_FAILED =
  DASHBOARD_ACTIONS + "SET_APPLICABLE_FAILED";

// Actions

export const fetchTasksByTeamPerformanceUserRequest = createAction(
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST
);
export const fetchTasksByTeamPerformanceUserSuccess = createAction(
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_SUCCESS
);
export const fetchTasksByTeamPerformanceUserFailed = createAction(
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_FAILED
);

export const clearTasksByTeamPerformance = createAction(
  CLEAR_TASKS_BY_TEAM_PERFORMANCE
);

export const fetchDashboardAnalyticsRequest = createAction(
  FETCH_DASHBOARD_ANALYTICS_REQUEST
);
export const fetchDashboardAnalyticsSuccess = createAction(
  FETCH_DASHBOARD_ANALYTICS_SUCCESS
);
export const fetchDashboardAnalyticsFailed = createAction(
  FETCH_DASHBOARD_ANALYTICS_FAILED
);

export const fetchDashboardTeamAnalyticsRequest = createAction(
  FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST
);
export const fetchDashboardTeamAnalyticsSuccess = createAction(
  FETCH_DASHBOARD_TEAM_ANALYTICS_SUCCESS
);
export const fetchDashboardTeamAnalyticsFailed = createAction(
  FETCH_DASHBOARD_TEAM_ANALYTICS_FAILED
);
export const clearDashboardAnalytics = createAction(CLEAR_DASHBOARD_ANALYTICS);

export const setCurrentViewByFilter = createAction(SET_CURRENT_VIEW_BY_FILTER);
export const setCurrentActiveTab = createAction(SET_CURRENT_ACTIVE_TAB);

export const fetchTasksRequest = createAction(FETCH_TASKS_REQUREST);
export const fetchTasksSuccess = createAction(FETCH_TASKS_SUCCESS);
export const fetchTasksFailed = createAction(FETCH_TASKS_FAILED);

export const fetchTasksByFilterRequest = createAction(
  FETCH_TASKS_BY_FILTER_REQUREST
);
export const fetchTasksByFilterSuccess = createAction(
  FETCH_TASKS_BY_FILTER_SUCCESS
);
export const fetchTasksByFilterFailed = createAction(
  FETCH_TASKS_BY_FILTER_FAILED
);

export const collapsAllTasks = createAction(COLLAPS_ALL_TASKS);

export const fetchTaskDetailRequest = createAction(FETCH_TASK_DETAIL_REQUEST);
export const fetchTaskDetailSuccess = createAction(FETCH_TASK_DETAIL_SUCCESS);
export const fetchTaskDetailFailed = createAction(FETCH_TASK_DETAIL_FAILED);
export const clearTaskDetail = createAction(CLEAR_TASK_DETAIL);

export const setCurrentDashboardTab = createAction(SET_CURRENT_DASHBOARD_TAB);

export const fetchTasksBySearchQueryRequest = createAction(
  FETCH_TASKS_BY_SEARCH_QUERY_REQUEST
);
export const fetchTasksBySearchQuerySuccess = createAction(
  FETCH_TASKS_BY_SEARCH_QUERY_SUCCESS
);
export const fetchTasksBySearchQueryFailed = createAction(
  FETCH_TASKS_BY_SEARCH_QUERY_FAILED
);

export const fetchAnalyticsTasksRequest = createAction(
  FETCH_ANALYTICS_TASKS_REQUEST
);
export const fetchAnalyticsTasksSuccess = createAction(
  FETCH_ANALYTICS_TASKS_SUCCESS
);
export const fetchAnalyticsTasksFailed = createAction(
  FETCH_ANALYTICS_TASKS_FAILED
);

export const clearAnalyticsTasks = createAction(CLEAR_ANALYTICS_TASKS);

export const setDashboardSearch = createAction(SET_DASHBOARD_SEARCH);
export const clearDashboardSearch = createAction(CLEAR_DASHBOARD_SEARCH);
export const setIsPaymentPlanActive = createAction(SET_IS_PAYMENT_PLAN_ACTIVE);
export const setActiveLicenses = createAction(SET_ACTIVE_LICENSES);
export const checkPaymentPlanStatus = createAction(CHECK_PAYMENT_PLANT_STATUS);

export const setTaskDetailCommentModal = createAction(
  SET_TASK_DETAIL_COMMENT_MODAL
);
export const setTaskDetailRefModal = createAction(SET_TASK_DETAIL_REF_MODAL);
export const setAddImpactModal = createAction(SET_ADD_IMPACT_MODAL);
export const setTaskDetailLogModal = createAction(SET_TASK_DETAIL_LOG_MODAL);
export const setTaskDetailImpactModal = createAction(
  SET_TASK_DETAIL_IMPACT_MODAL
);
export const fetchImpactDetailsByTaskId = createAction(
  FETCH_IMPACT_DETAILS_BY_TASK
);
export const setIsRefEdited = createAction(SET_IS_REF_EDITED);
export const setNotApplicableRequest = createAction(SET_NOT_APPLICABLE_REQUEST);
export const setNotApplicableSuccess = createAction(SET_NOT_APPLICABLE_SUCCESS);
export const setNotApplicableFailed = createAction(SET_NOT_APPLICABLE_FAILED);
export const setApplicableRequest = createAction(SET_APPLICABLE_REQUEST);
export const setApplicableSuccess = createAction(SET_APPLICABLE_SUCCESS);
export const setApplicableFailed = createAction(SET_APPLICABLE_FAILED);
