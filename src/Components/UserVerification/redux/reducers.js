import { handleActions } from "redux-actions";
import { types } from "./actions";

const actionHandler = {
  [types.UPDATE_PHONE_NUMBER_OTP_REQUEST]: (state) => ({
    ...state,
    updateMobileNumber: false,
    otpInfo: {},
  }),
  [types.UPDATE_PHONE_NUMBER_OTP_REQUEST_FAILED]: (state) => ({
    ...state,
    updateMobileNumber: false,
    otpInfo: {},
  }),
  [types.UPDATE_PHONE_NUMBER_OTP_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    updateMobileNumber: false,
    otpInfo: payload,
  }),
  [types.USER_DATA_SAVE_REQUEST]: (state) => ({
    ...state,
    isLoading: true,
    personalInfo: {},
  }),
  [types.USER_DATA_SAVE_REQUEST_FAILED]: (state) => ({
    ...state,
    isLoading: false,
    personalInfo: {},
  }),
  [types.USER_DATA_SAVE_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    personalInfo: payload,
  }),
};

export default handleActions(actionHandler, {
  isLoading: false,
  updateMobileNumber: false,
  otpInfo: {},
  personalInfo: {},
});
