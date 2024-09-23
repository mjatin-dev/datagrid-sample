import { handleActions } from "redux-actions";
import { types } from "./actions";

const actionHandler = {
  [types.ACTIVE_MENU_ACTIONS]: (state, { payload }) => ({
    ...state,
    currentMenu: payload,
  }),
  [types.SET_CURRENT_FILTER_MENU]: (state, { payload }) => ({
    ...state,
    currentFilterViewBy: payload,
  }),
  [types.MODAL_OPEN_FLAG]: (state, { payload }) => ({
    ...state,
    openModalFlag: payload,
  }),

  [types.SETTING_ACTIVE_TAB]: (state, { payload }) => ({
    ...state,
    activeTab: payload,
  }),

  [types.SET_CURRENT_TASK_ID_BV]: (state, { payload }) => ({
    ...state,
    taskID: payload,
  }),

  [types.SET_TASK_ID_CALENDAR]: (state, { payload }) => ({
    ...state,
    taskIDByCalendarView: payload,
  }),

  [types.SET_DASHBOARD_TAB]: (state, { payload }) => ({
    ...state,
    dashboardCurrentTab: payload,
  }),
  [types.SET_TAKE_ACTION_TAB]: (state, { payload }) => ({
    ...state,
    takeActionActiveTab: payload,
  }),
  [types.SET_TAKE_ACTION_TAB_KEY]: (state, { payload }) => ({
    ...state,
    takeActionActiveTab: {
      ...state.takeActionActiveTab,
      key: payload,
    },
  }),
  [types.SET_MOBILE_DASHBOARD_VIEW_TYPE]: (state, { payload }) => ({
    ...state,
    mobileDashboardViewType: payload,
  }),
  [types.SET_SUGGESTIONS_SHOW]: (state, { payload }) => ({
    ...state,
    isShowSuggestion: payload,
  }),
  [types.SET]: (state, { payload }) => ({
    ...state,
    isShowSuggestion: payload,
  }),
  [types.SET_IS_SHOW_LOGOUT_MODAL]: (state, { payload }) => ({
    ...state,
    isShowLogoutModal: payload,
  }),
  [types.SET_TEAM_PERFORMANCE_USER]: (state, { payload }) => ({
    ...state,
    teamPerformanceUser: payload,
  }),
  [types.SET_CURRENT_DASHBOARD_VIEW_MOBILE]: (state, { payload }) => ({
    ...state,
    currentDashboardViewMobile: payload,
  }),
};

export default handleActions(actionHandler, {
  currentMenu: "dashboard",
  activeTab: "personal",
  openModalFlag: false,
  currentFilterViewBy: "status",
  taskID: null,
  taskIDByCalendarView: null,
  dashboardCurrentTab: "List",
  takeActionActiveTab: "",
  mobileDashboardViewType: "0",
  isShowSuggestion: false,
  isShowLogoutModal: false,
  teamPerformanceUser: null,
  currentDashboardViewMobile: "overview", // "overview" | "tasks"
});
