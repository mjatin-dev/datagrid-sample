import moment from "moment";
import {
  CLEAR_STATE,
  SET_ACTIVE_FLAG,
  SET_DAY,
  SET_FILTERS,
  SET_LOADING,
  SET_MONTH,
  SET_SUCCESS,
  SET_WEEK,
} from "./types";
const currentWeek = moment().week();
const currentYear = new Date().getFullYear();
const currentWeekStartDate = moment(
  `${currentYear}-${currentWeek}`,
  "YYYY-w"
).format("YYYY-MM-DD");
const initialState = {
  daysData: [],
  weekData: [],
  monthData: [],
  isSuccess: false,
  isLoading: false,
  activeFlag: "month",
  filters: {
    dayDate: new Date(),
    weekStartDate: new Date(currentWeekStartDate),
    monthDate: new Date(),
    sevenDays: [],
  },
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DAY:
      return {
        ...state,
        daysData: [...payload],
      };

    case SET_WEEK:
      return {
        ...state,
        weekData: [...payload],
      };

    case SET_MONTH:
      return {
        ...state,
        monthData: [...payload],
      };

    case SET_SUCCESS:
      return {
        ...state,
        isSuccess: payload,
      };

    case SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };

    case CLEAR_STATE:
      return {
        ...state,
        daysData: [],
        weekData: [],
        monthData: [],
        filters: {
          ...initialState.filters,
        },
      };
    case SET_ACTIVE_FLAG:
      return {
        ...state,
        activeFlag: payload,
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state?.filters,
          [payload.key]: payload.value,
        },
      };
    default:
      return state;
  }
};

export default reducer;
