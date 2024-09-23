import { handleActions } from "redux-actions";
import { types } from "./actions";

const actionHandler = {
  [types.UPDATE_EMAIL_INFO]: (state, { payload }) => ({
    ...state,
    loginInfo: payload,
  }),

  [types.SET_COMPANY_EXISTS]: (state, { payload }) => ({
    ...state,
    isCompanyExists: payload,
  }),

  [types.SIGN_IN_REQUEST]: (state) => ({
    ...state,
    loginSuccess: false,
    isLoading: true,
    loginInfo: {},
  }),
  [types.LOGOUT_REQUEST]: (state) => {
    return {
      ...state,
      loginSuccess: false,
      loginInfo: {},
    };
  },
  [types.SIGN_IN_REQUEST_FAILED]: (state) => ({
    ...state,
    loginSuccess: false,
    isLoading: false,
    loginInfo: {},
  }),
  [types.SIGN_IN_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    loginSuccess: true,
    isLoading: false,
    loginInfo: payload.data,
  }),
  [types.UPDATE_PASSWORD_REQUEST]: (state) => ({
    ...state,
    updatePasswordInfo: {},
  }),
  [types.UPDATE_PASSWORD_REQUEST_FAILED]: (state) => ({
    ...state,
    updatePasswordInfo: {},
  }),
  [types.UPDATE_PASSWORD_REQUEST_SUCCESS]: (state, { payload }) => ({
    ...state,
    updatePasswordInfo: payload,
  }),
  [types.UPDATE_USER_TYPE]: (state, { payload }) => ({
    ...state,
    ...state.loginInfo,
    userType: payload,
  }),
  [types.GET_USER_ROLES_SUCCESS]: (state, { payload }) => ({
    ...state,
    userRoles: payload,
  }),

  [types.UPDATE_USER_NAME]: (state, { payload }) => ({
    ...state,
    loginInfo: {
      ...state?.loginInfo,
      UserName: payload,
    },
  }),
};

export default handleActions(actionHandler, {
  loginSuccess: false,
  isLoading: false,
  loginInfo: {},
  updatePasswordInfo: {},
  userRoles: [],
});
