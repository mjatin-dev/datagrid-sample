const { createAction } = require("redux-actions");

const createActionType = (type, prefix = "EVENTS_MODULE/") => prefix + type;

const FETCH_CIRCULARS_REQUEST = createActionType("FETCH_CIRCULARS_REQUEST");
const FETCH_CIRCULARS_SUCCESS = createActionType("FETCH_CIRCULARS_SUCCESS");
const FETCH_CIRCULARS_FAILED = createActionType("FETCH_CIRCULARS_FAILED");

const SET_MODAL_STATE = createActionType("SET_MODAL_STATE");

const ADD_UPDATE_CIRCULAR_REQUEST = createActionType(
  "ADD_UPDATE_CIRCULAR_REQUEST"
);
const ADD_UPDATE_CIRCULAR_SUCCESS = createActionType(
  "ADD_UPDATE_CIRCULAR_SUCCESS"
);
const ADD_UPDATE_CIRCULAR_FAILED = createActionType(
  "ADD_UPDATE_CIRCULAR_FAILED"
);

const SET_CIRCULAR_STATUS_REQUEST = createActionType(
  "SET_CIRCULAR_STATUS_REQUEST"
);
const SET_CIRCULAR_STATUS_SUCCESS = createActionType(
  "SET_CIRCULAR_STATUS_SUCCESS"
);
const SET_CIRCULAR_STATUS_FAILED = createActionType(
  "SET_CIRCULAR_STATUS_FAILED"
);

const SET_SELECTED_USER = createActionType("SET_SELECTED_USER");

const SET_COMMENT_MODAL = createActionType("SET_COMMENT_MODAL");

const SET_REJECTION_COMMENT_MODAL = createActionType(
  "SET_REJECTION_COMMENT_MODAL"
);

const fetchCircularsRequest = createAction(FETCH_CIRCULARS_REQUEST);
const fetchCircularsSuccess = createAction(FETCH_CIRCULARS_SUCCESS);
const fetchCircularsFailed = createAction(FETCH_CIRCULARS_FAILED);

const setModalState = createAction(SET_MODAL_STATE);

const addUpdateCircularRequest = createAction(ADD_UPDATE_CIRCULAR_REQUEST);
const addUpdateCircularSuccess = createAction(ADD_UPDATE_CIRCULAR_SUCCESS);
const addUpdateCircularFailed = createAction(ADD_UPDATE_CIRCULAR_FAILED);

const setCircularStatusRequest = createAction(SET_CIRCULAR_STATUS_REQUEST);
const setCircularStatusSuccess = createAction(SET_CIRCULAR_STATUS_SUCCESS);
const setCircularStatusFailed = createAction(SET_CIRCULAR_STATUS_FAILED);

const setSelectedUser = createAction(SET_SELECTED_USER);
const setCommentModal = createAction(SET_COMMENT_MODAL);
const setRejectionCommentModal = createAction(SET_REJECTION_COMMENT_MODAL);
export const eventsModuleTypes = {
  FETCH_CIRCULARS_REQUEST,
  FETCH_CIRCULARS_SUCCESS,
  FETCH_CIRCULARS_FAILED,

  SET_MODAL_STATE,

  ADD_UPDATE_CIRCULAR_FAILED,
  ADD_UPDATE_CIRCULAR_REQUEST,
  ADD_UPDATE_CIRCULAR_SUCCESS,

  SET_CIRCULAR_STATUS_FAILED,
  SET_CIRCULAR_STATUS_REQUEST,
  SET_CIRCULAR_STATUS_SUCCESS,

  SET_SELECTED_USER,
  SET_COMMENT_MODAL,
  SET_REJECTION_COMMENT_MODAL,
};

export const eventsModuleActions = {
  fetchCircularsRequest,
  fetchCircularsSuccess,
  fetchCircularsFailed,

  setModalState,

  addUpdateCircularFailed,
  addUpdateCircularRequest,
  addUpdateCircularSuccess,

  setCircularStatusRequest,
  setCircularStatusFailed,
  setCircularStatusSuccess,

  setSelectedUser,
  setCommentModal,
  setRejectionCommentModal,
};
