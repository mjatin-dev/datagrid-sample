import { CURRENT_OPENED_ASSIGNMENT_NAME } from "./types";

const initialState = {
  assignments: {
    currentOpenedAssignmentName: "",
  },
};

const auditCommonUtilsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CURRENT_OPENED_ASSIGNMENT_NAME:
      return {
        ...state,
        assignments: {
          ...state?.assignments,
          currentOpenedAssignmentName: payload,
        },
      };
    default:
      return state;
  }
};

export default auditCommonUtilsReducer;
