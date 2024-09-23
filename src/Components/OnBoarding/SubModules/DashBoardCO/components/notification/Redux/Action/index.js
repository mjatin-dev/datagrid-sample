import { SET_NOTIFICATION_FILTER, SET_NOTIFICATION_TASK } from "./types";
export const setNotificationTaskId = (payload) => {
  return {
    type: SET_NOTIFICATION_TASK,
    payload: payload,
  };
};
export const setNotificationFilter = (payload) => {
  return {
    type: SET_NOTIFICATION_FILTER,
    payload: payload,
  };
};
