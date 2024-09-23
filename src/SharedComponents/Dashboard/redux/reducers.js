import { handleActions } from "redux-actions";
import {
  CLEAR_ANALYTICS_TASKS,
  CLEAR_DASHBOARD_ANALYTICS,
  CLEAR_DASHBOARD_SEARCH,
  CLEAR_TASKS_BY_TEAM_PERFORMANCE,
  CLEAR_TASK_DETAIL,
  COLLAPS_ALL_TASKS,
  FETCH_ANALYTICS_TASKS_FAILED,
  FETCH_ANALYTICS_TASKS_REQUEST,
  FETCH_ANALYTICS_TASKS_SUCCESS,
  FETCH_DASHBOARD_ANALYTICS_FAILED,
  FETCH_DASHBOARD_ANALYTICS_REQUEST,
  FETCH_DASHBOARD_ANALYTICS_SUCCESS,
  FETCH_DASHBOARD_TEAM_ANALYTICS_FAILED,
  FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST,
  FETCH_DASHBOARD_TEAM_ANALYTICS_SUCCESS,
  FETCH_IMPACT_DETAILS_BY_TASK,
  FETCH_TASKS_BY_FILTER_FAILED,
  FETCH_TASKS_BY_FILTER_REQUREST,
  FETCH_TASKS_BY_FILTER_SUCCESS,
  FETCH_TASKS_BY_SEARCH_QUERY_FAILED,
  FETCH_TASKS_BY_SEARCH_QUERY_REQUEST,
  FETCH_TASKS_BY_SEARCH_QUERY_SUCCESS,
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_FAILED,
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST,
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_SUCCESS,
  FETCH_TASKS_FAILED,
  FETCH_TASKS_REQUREST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASK_DETAIL_FAILED,
  FETCH_TASK_DETAIL_REQUEST,
  FETCH_TASK_DETAIL_SUCCESS,
  SET_ACTIVE_LICENSES,
  SET_ADD_IMPACT_MODAL,
  SET_APPLICABLE_FAILED,
  SET_APPLICABLE_REQUEST,
  SET_APPLICABLE_SUCCESS,
  SET_CURRENT_ACTIVE_TAB,
  SET_CURRENT_DASHBOARD_TAB,
  SET_CURRENT_VIEW_BY_FILTER,
  SET_DASHBOARD_SEARCH,
  SET_IS_PAYMENT_PLAN_ACTIVE,
  SET_IS_REF_EDITED,
  SET_NOT_APPLICABLE_FAILED,
  SET_NOT_APPLICABLE_REQUEST,
  SET_NOT_APPLICABLE_SUCCESS,
  SET_TASK_DETAIL_COMMENT_MODAL,
  SET_TASK_DETAIL_IMPACT_MODAL,
  SET_TASK_DETAIL_LOG_MODAL,
  SET_TASK_DETAIL_REF_MODAL,
} from "./actions";
import { dashboardTabs, dashboardViews, viewByFilters } from "../../Constants";
const actionHandler = {
  [SET_CURRENT_ACTIVE_TAB]: (state, { payload }) => ({
    ...state,
    currentActiveTab: payload,
  }),
  [SET_CURRENT_VIEW_BY_FILTER]: (state, { payload }) => ({
    ...state,
    currentViewByFilter: payload,
  }),

  [FETCH_TASKS_REQUREST]: (state) => ({
    ...state,
    tasks: {
      ...state?.tasks,
      isLoading: true,
      list: state?.tasks?.list,
    },
  }),
  [FETCH_TASKS_SUCCESS]: (state, { payload }) => ({
    ...state,
    tasks: {
      ...state?.tasks,
      isLoading: false,
      list: [...payload],
    },
  }),
  [FETCH_TASKS_FAILED]: (state) => ({
    ...state,
    tasks: {
      ...state?.tasks,
      isLoading: false,
      list: state?.tasks?.list,
    },
  }),

  [FETCH_TASKS_BY_FILTER_REQUREST]: (state, { payload }) => ({
    ...state,
    tasksByFilter: {
      ...state?.tasksByFilter,
      isLoading: true,
      loadingKey: payload?.key,
      data: state?.tasksByFilter?.data,
    },
  }),
  [FETCH_TASKS_BY_FILTER_SUCCESS]: (state, { payload }) => ({
    ...state,
    tasksByFilter: {
      ...state?.tasksByFilter,
      isLoading: false,
      data: payload,
    },
  }),
  [FETCH_TASKS_BY_FILTER_FAILED]: (state, { payload }) => ({
    ...state,
    tasksByFilter: {
      ...state?.tasksByFilter,
      isLoading: false,
      data: payload,
    },
  }),

  [COLLAPS_ALL_TASKS]: (state, { payload }) => {
    const { key } = payload;
    const tasks = [...state?.tasks?.list];
    let tasksListIndex = tasks.findIndex(
      (item) => item?.keyName === key || item?.keyId === key
    );
    if (tasks[tasksListIndex]?.tasks?.length > 3) {
      tasks[tasksListIndex].tasks = tasks[tasksListIndex].tasks.slice(0, 3);
    }
    return {
      ...state,
      tasks: {
        ...state?.tasks,
        list: [...tasks],
      },
    };
  },

  [FETCH_TASK_DETAIL_REQUEST]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state?.taskDetailById,
      isShowTaskDetail: true,
      isLoading: true,
      id: payload,
      data: {},
    },
  }),
  [FETCH_TASK_DETAIL_SUCCESS]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state?.taskDetailById,
      isLoading: false,
      data: payload,
    },
  }),

  [FETCH_TASK_DETAIL_FAILED]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state?.taskDetailById,
      isLoading: false,
      data: {},
    },
  }),
  [CLEAR_TASK_DETAIL]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      id: "",
      isShowTaskDetail: false,
      isLoading: false,
      data: {},
    },
  }),

  [SET_CURRENT_DASHBOARD_TAB]: (state, { payload }) => ({
    ...state,
    currentDashboardTab: payload,
  }),

  [FETCH_TASKS_BY_SEARCH_QUERY_REQUEST]: (state) => ({
    ...state,
    tasksBySearchQuery: {
      ...state?.tasksBySearchQuery,
      isLoading: true,
      isNotFound: false,
    },
  }),
  [FETCH_TASKS_BY_SEARCH_QUERY_SUCCESS]: (state, { payload }) => ({
    ...state,
    tasksBySearchQuery: {
      ...state?.tasksBySearchQuery,
      isLoading: false,
      data: { ...payload },
      isNotFound: false,
    },
  }),
  [FETCH_TASKS_BY_SEARCH_QUERY_FAILED]: (state) => ({
    ...state,
    tasksBySearchQuery: {
      ...state?.tasksBySearchQuery,
      isLoading: false,
      data: {},
      isNotFound: true,
    },
  }),

  [SET_DASHBOARD_SEARCH]: (state, { payload }) => ({
    ...state,
    tasksBySearchQuery: {
      ...state?.tasksBySearchQuery,
      ...payload,
    },
  }),

  [CLEAR_DASHBOARD_SEARCH]: (state) => ({
    ...state,
    tasksBySearchQuery: {
      ...state.tasksBySearchQuery,
      isLoading: false,
      data: {},
      isNotFound: false,
      isShowSearchBox: false,
      searchQuery: "",
    },
  }),

  [SET_IS_PAYMENT_PLAN_ACTIVE]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isPaymentPlanActive: payload,
    },
  }),
  [SET_ACTIVE_LICENSES]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      activeLicenses: payload,
    },
  }),

  [FETCH_ANALYTICS_TASKS_REQUEST]: (state, { payload }) => ({
    ...state,
    tasksByAnalytics: {
      ...state.tasksByAnalytics,
      isLoading: true,
      key: payload.key,
      filter: payload.filter,
    },
  }),
  [FETCH_ANALYTICS_TASKS_SUCCESS]: (state, { payload }) => ({
    ...state,
    tasksByAnalytics: {
      ...state.tasksByAnalytics,
      isLoading: false,
      data: payload,
    },
  }),
  [FETCH_ANALYTICS_TASKS_FAILED]: (state) => ({
    ...state,
    tasksByAnalytics: {
      ...state.tasksByAnalytics,
      isLoading: false,
    },
  }),
  [CLEAR_ANALYTICS_TASKS]: (state) => ({
    ...state,
    tasksByAnalytics: {
      ...state.tasksByAnalytics,
      isLoading: false,
      key: "",
      filter: "",
      data: {},
    },
  }),

  [FETCH_DASHBOARD_ANALYTICS_REQUEST]: (state) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isLoading: true,
    },
  }),
  [FETCH_DASHBOARD_ANALYTICS_SUCCESS]: (state, { payload }) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isLoading: false,
      ...payload,
    },
  }),
  [FETCH_DASHBOARD_ANALYTICS_FAILED]: (state) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isLoading: false,
    },
  }),

  [FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST]: (state) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isTeamAnalyticsLoading: true,
    },
  }),
  [FETCH_DASHBOARD_TEAM_ANALYTICS_SUCCESS]: (state, { payload }) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isTeamAnalyticsLoading: false,
      teamStats: payload,
    },
  }),
  [FETCH_DASHBOARD_TEAM_ANALYTICS_FAILED]: (state) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isTeamAnalyticsLoading: false,
      teamStats: [],
    },
  }),

  [CLEAR_DASHBOARD_ANALYTICS]: (state) => ({
    ...state,
    dashboardAnalytics: {
      ...state.dashboardAnalytics,
      isLoading: false,
      teamStats: [],
      dashboardStats: [],
      analyticsData: {
        approvalPending: {},
        completedTask: {},
        next7Days: {},
        next30Days: {},
        notAssigned: {},
        riskDelay: {},
        beyond30Days: {},
      },
    },
  }),

  [FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST]: (state, { payload }) => ({
    ...state,
    tasksByTeamPerformanceUser: {
      ...state.tasksByTeamPerformanceUser,
      key: payload.key,
      isLoading: true,
    },
  }),
  [FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_SUCCESS]: (state, { payload }) => ({
    ...state,
    tasksByTeamPerformanceUser: {
      ...state.tasksByTeamPerformanceUser,
      data: payload,
      isLoading: false,
    },
  }),
  [FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_FAILED]: (state) => ({
    ...state,
    tasksByTeamPerformanceUser: {
      ...state.tasksByTeamPerformanceUser,
      isLoading: false,
    },
  }),
  [CLEAR_TASKS_BY_TEAM_PERFORMANCE]: (state) => ({
    ...state,
    tasksByTeamPerformanceUser: {
      isLoading: false,
      key: "",
      filter: "Team",
      data: {},
    },
  }),

  [SET_TASK_DETAIL_COMMENT_MODAL]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isShowCommentDetails: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
      },
    },
  }),
  [SET_TASK_DETAIL_LOG_MODAL]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isShowLogDetails: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
      },
    },
  }),
  [SET_TASK_DETAIL_IMPACT_MODAL]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isShowImpactDetails: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
        isLoading: payload.isLoading || false,
      },
    },
  }),
  [FETCH_IMPACT_DETAILS_BY_TASK]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isShowImpactDetails: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
        isLoading: payload?.isLoading || false,
      },
    },
  }),
  [SET_ADD_IMPACT_MODAL]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isAddImpact: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
      },
    },
  }),
  [SET_TASK_DETAIL_REF_MODAL]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isShowReferenceDetails: (payload && payload?.isShow) || false,
        data: (payload && payload.data) || null,
      },
    },
  }),
  [SET_IS_REF_EDITED]: (state, { payload }) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      modals: {
        ...state.taskDetailById.modals,
        isReferenceEdited: payload,
      },
    },
  }),
  [SET_NOT_APPLICABLE_REQUEST]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: true,
    },
  }),
  [SET_NOT_APPLICABLE_SUCCESS]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: false,
    },
  }),
  [SET_NOT_APPLICABLE_FAILED]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: false,
    },
  }),
  [SET_APPLICABLE_REQUEST]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: true,
    },
  }),
  [SET_APPLICABLE_SUCCESS]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: false,
    },
  }),
  [SET_APPLICABLE_FAILED]: (state) => ({
    ...state,
    taskDetailById: {
      ...state.taskDetailById,
      isTaskActionPending: false,
    },
  }),
};

export default handleActions(actionHandler, {
  currentActiveTab: dashboardTabs[0],
  currentDashboardTab: dashboardViews[0],
  currentViewByFilter: viewByFilters[0],
  dashboardAnalytics: {
    isTeamAnalyticsLoading: false,
    isLoading: false,
    teamStats: [],
    dashboardStats: [],
    analyticsData: {
      approvalPending: {},
      completedTask: {},
      next7Days: {},
      next30Days: {},
      notAssigned: {},
      riskDelay: {},
      beyond30Days: {},
    },
  },
  tasks: {
    isLoading: false,
    list: [],
  },
  tasksBySearchQuery: {
    isLoading: false,
    data: {},
    isNotFound: false,
    isShowSearchBox: false,
    searchQuery: "",
  },
  tasksByFilter: {
    isLoading: false,
    loadingKey: "",
    data: [],
  },
  tasksByAnalytics: {
    isLoading: false,
    key: "",
    filter: "",
    data: {},
  },
  tasksByTeamPerformanceUser: {
    isLoading: false,
    key: "",
    filter: "Team",
    data: {},
  },
  taskDetailById: {
    isTaskActionPending: false,
    isPaymentPlanActive: false,
    activeLicenses: [],
    id: "",
    isShowTaskDetail: false,
    isLoading: false,
    data: {},
    modals: {
      isShowCommentDetails: false,
      isShowReferenceDetails: false,
      isShowLogDetails: false,
      isShowImpactDetails: false,
      isReferenceEdited: false,
      data: null,
    },
  },
});
