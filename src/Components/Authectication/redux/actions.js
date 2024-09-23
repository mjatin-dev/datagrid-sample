import { createAction } from "redux-actions";

// Action type

const SIGN_IN_REQUEST = "CAPMTECH/SIGN_IN_REQUEST";
const SIGN_IN_REQUEST_SUCCESS = "CAPMTECH/SIGN_IN_REQUEST_SUCCESS";
const SIGN_IN_REQUEST_FAILED = "CAPMTECH/SIGN_IN_REQUEST_FAILED";

const LOGOUT_REQUEST = "CAPMTECH/LOGOUT_REQUEST";
const SUGGESTION_REQUEST = "CAPMTECH/SUGGESTION_REQUEST";

const UPDATE_PASSWORD_REQUEST = "CAPMTECH/UPDATE_PASSWORD_REQUEST";
const UPDATE_PASSWORD_REQUEST_SUCCESS =
  "CAPMTECH/UPDATE_PASSWORD_REQUEST_SUCCESS";
const UPDATE_PASSWORD_REQUEST_FAILED =
  "CAPMTECH/UPDATE_PASSWORD_REQUEST_FAILED";

const UPDATE_EMAIL_INFO = "CAPMTECH/UPDATE_EMAIL_INFO";
const UPDATE_USER_TYPE = "CAPMTECH/UPDATE_EMAIL_INFO";

const UPDATE_USER_NAME = "CAPMTECH/UPDATE_USER_NAME";

const GET_USER_ROLES_REQUEST = "GET_USER_ROLES_REQUEST";
const GET_USER_ROLES_SUCCESS = "GET_USER_ROLES_SUCCESS";
const GET_USER_ROLES_FAILURE = "GET_USER_ROLES_FAILURE";

const SET_COMPANY_EXISTS = "SET_COMPANY_EXISTS";

const REMOVE_FCM_TOKEN_REQUEST = "REMOVE_FCM_TOKEN_REQUEST";

// Action method
const signInRequest = createAction(SIGN_IN_REQUEST);
const signInRequestSuccess = createAction(SIGN_IN_REQUEST_SUCCESS);
const signInRequestFailed = createAction(SIGN_IN_REQUEST_FAILED);

const updateCompanyExists = createAction(SET_COMPANY_EXISTS);

export const createLogoutAction = createAction(LOGOUT_REQUEST);
export const createSuggestionAction = createAction(SUGGESTION_REQUEST);

const updatePasswordRequest = createAction(UPDATE_PASSWORD_REQUEST);
const updatePasswordRequestSuccess = createAction(
  UPDATE_PASSWORD_REQUEST_SUCCESS
);
const updatePasswordRequestFailed = createAction(
  UPDATE_PASSWORD_REQUEST_FAILED
);

const updateEmailInfo = createAction(UPDATE_EMAIL_INFO);
const updateUserType = createAction(UPDATE_USER_TYPE);

const updateUserName = createAction(UPDATE_USER_NAME);

const getUserRolesRequest = createAction(GET_USER_ROLES_REQUEST);
const getUserRolesSuccess = createAction(GET_USER_ROLES_SUCCESS);
const getUserRolesFailure = createAction(GET_USER_ROLES_SUCCESS);

const removeFcmToken = createAction(REMOVE_FCM_TOKEN_REQUEST);

export const actions = {
  signInRequest,
  signInRequestSuccess,
  signInRequestFailed,

  updatePasswordRequest,
  updatePasswordRequestSuccess,
  updatePasswordRequestFailed,

  updateEmailInfo,
  createLogoutAction,
  updateUserType,

  getUserRolesRequest,
  getUserRolesSuccess,
  getUserRolesFailure,
  updateCompanyExists,

  updateUserName,

  removeFcmToken,
};

export const types = {
  UPDATE_EMAIL_INFO,

  SIGN_IN_REQUEST,
  SIGN_IN_REQUEST_SUCCESS,
  SIGN_IN_REQUEST_FAILED,
  LOGOUT_REQUEST,
  SUGGESTION_REQUEST,

  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_REQUEST_SUCCESS,
  UPDATE_PASSWORD_REQUEST_FAILED,
  UPDATE_USER_TYPE,

  GET_USER_ROLES_REQUEST,
  GET_USER_ROLES_SUCCESS,
  GET_USER_ROLES_FAILURE,
  SET_COMPANY_EXISTS,

  UPDATE_USER_NAME,

  REMOVE_FCM_TOKEN_REQUEST,
};
