import {
  SET_NOTIFICATION_FILTER,
  SET_NOTIFICATION_TASK,
  SET_TASK_ID,
} from "../Action/types";
const initialState = {
  taskID: null,
  activeFilter: {
    value: "All Notifications",
    label: "All Notifications",
  },
};

export default function NotificationRedu(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION_TASK:
      return {
        taskID: action.payload,
      };
    case SET_TASK_ID:
      return { ...state, taskID: action.payload };
    case SET_NOTIFICATION_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
      };
    default:
      return state;
  }
}
