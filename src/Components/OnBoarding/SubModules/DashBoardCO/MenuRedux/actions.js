import { createAction } from "redux-actions";

const ACTIVE_MENU_ACTIONS = "CAPMTECH/ACTIVE_MENU_ACTIONS";

const SETTING_ACTIVE_TAB = "CAPMTECH/SETTING_ACTIVE_TAB";
const MODAL_OPEN_FLAG = "CAPMTECH/MODAL_OPEN_FLAG";
const SET_CURRENT_FILTER_MENU = "CAPMTECH/SET_CURRENT_FILTER_MENU";
const SET_CURRENT_TASK_ID_BV = "CAPMTECH/SET_CURRENT_TASK_ID_BV";
const SET_TASK_ID_CALENDAR = "CAPMTECH/SET_TASK_ID_CALENDAR";
const SET_DASHBOARD_TAB = "CAPMTECH/SET_DASHBOARD_TAB";
const SET_TAKE_ACTION_TAB = "CAPMTECH/SET_TAKE_ACTION_TAB";
const SET_MOBILE_DASHBOARD_VIEW_TYPE =
  "CAPMTECH/SET_MOBILE_DASHBOARD_VIEW_TYPE";
const SET_SUGGESTIONS_SHOW = "SUGGESTION/SET_SUGGESTIONS_SHOW";
const SET_TAKE_ACTION_TAB_KEY = "CAPMTECH/SET_TAKE_ACTION_TAB_KEY";
const SET_IS_SHOW_LOGOUT_MODAL = "CAPMTECH/SET_IS_SHOW_LOGOUT_MODAL";
const SET_IS_SHOW_SUGGESTION_MODAL = "CAPMTECH/SET_IS_SHOW_SUGGESTION_MODAL";
const SET_TEAM_PERFORMANCE_USER = "SET_TEAM_PERFORMANCE_USER";
const SET_CURRENT_DASHBOARD_VIEW_MOBILE = "SET_CURRENT_DASHBOARD_VIEW_MOBILE";
export const setCurrentMenu = createAction(ACTIVE_MENU_ACTIONS);
const setActiveTabInSetting = createAction(SETTING_ACTIVE_TAB);
const setIsModalOpen = createAction(MODAL_OPEN_FLAG);
const setCurrentFilterMenuViewBy = createAction(SET_CURRENT_FILTER_MENU);
const setCurrentBoardViewTaskId = createAction(SET_CURRENT_TASK_ID_BV);
const setCurrentCalendarViewTaskId = createAction(SET_TASK_ID_CALENDAR);
const setDashboardTab = createAction(SET_DASHBOARD_TAB);
const setTakeActionTab = createAction(SET_TAKE_ACTION_TAB);
const setTakeActionTabKey = createAction(SET_TAKE_ACTION_TAB_KEY);
const setDashboardViewType = createAction(SET_MOBILE_DASHBOARD_VIEW_TYPE);
export const setSuggestionShow = createAction(SET_SUGGESTIONS_SHOW);
export const setIsShowLogoutModal = createAction(SET_IS_SHOW_LOGOUT_MODAL);
export const setSuggestionModal = createAction(SET_IS_SHOW_SUGGESTION_MODAL);
export const setTeamPerformanceUser = createAction(SET_TEAM_PERFORMANCE_USER);
export const setCurrentDashboardViewMobile = createAction(
  SET_CURRENT_DASHBOARD_VIEW_MOBILE
);

export const types = {
  ACTIVE_MENU_ACTIONS,
  SETTING_ACTIVE_TAB,
  MODAL_OPEN_FLAG,
  SET_CURRENT_FILTER_MENU,
  SET_CURRENT_TASK_ID_BV,
  SET_TASK_ID_CALENDAR,
  SET_DASHBOARD_TAB,
  SET_TAKE_ACTION_TAB,
  SET_TAKE_ACTION_TAB_KEY,
  SET_MOBILE_DASHBOARD_VIEW_TYPE,
  SET_SUGGESTIONS_SHOW,
  SET_IS_SHOW_LOGOUT_MODAL,
  SET_IS_SHOW_SUGGESTION_MODAL,
  SET_TEAM_PERFORMANCE_USER,
  SET_CURRENT_DASHBOARD_VIEW_MOBILE,
};

export const actions = {
  setCurrentMenu,
  setActiveTabInSetting,
  setIsModalOpen,
  setCurrentFilterMenuViewBy,
  setCurrentBoardViewTaskId,
  setCurrentCalendarViewTaskId,
  setDashboardTab,
  setTakeActionTab,
  setDashboardViewType,
  setTakeActionTabKey,
  setTeamPerformanceUser,
  setCurrentDashboardViewMobile,
};
