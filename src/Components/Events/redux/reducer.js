import { handleActions } from "redux-actions";
import { eventsModuleTypes as types } from "./actions";
const actionHandler = {
  [types.FETCH_CIRCULARS_REQUEST]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isLoading: true,
    },
  }),
  [types.FETCH_CIRCULARS_SUCCESS]: (state, { payload }) => ({
    ...state,
    circular: {
      ...state?.circular,
      isLoading: false,
      list: payload,
    },
  }),
  [types.FETCH_CIRCULARS_FAILED]: (state, { payload }) => ({
    ...state,
    circular: {
      ...state?.circular,
      isLoading: false,
      list: [],
    },
  }),

  [types.SET_MODAL_STATE]: (state, { payload }) => ({
    ...state,
    circular: {
      ...state?.circular,
      modalState: {
        ...state?.circular?.modalState,
        ...payload,
      },
    },
  }),

  [types.ADD_UPDATE_CIRCULAR_REQUEST]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: true,
    },
  }),
  [types.ADD_UPDATE_CIRCULAR_SUCCESS]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: false,
      modalState: {
        isVisible: false,
        data: {},
      },
    },
  }),
  [types.ADD_UPDATE_CIRCULAR_FAILED]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: false,
    },
  }),

  [types.SET_CIRCULAR_STATUS_REQUEST]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: true,
    },
  }),
  [types.SET_CIRCULAR_STATUS_SUCCESS]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: false,
      modalState: {
        isVisible: false,
        data: {},
      },
    },
  }),
  [types.SET_CIRCULAR_STATUS_FAILED]: (state) => ({
    ...state,
    circular: {
      ...state?.circular,
      isSavingData: false,
    },
  }),
  [types.SET_SELECTED_USER]: (state, { payload }) => ({
    ...state,
    selectedUser: payload,
  }),
  [types.SET_COMMENT_MODAL]: (state, { payload }) => ({
    ...state,
    commentsModal: {
      ...state.commentsModal,
      ...payload,
    },
  }),
  [types.SET_REJECTION_COMMENT_MODAL]: (state, { payload }) => ({
    ...state,
    rejectionCommentModal: {
      ...state.rejectionCommentModal,
      ...payload,
    },
  }),
};

const eventsModuleReducer = handleActions(actionHandler, {
  circular: {
    isLoading: false,
    isSavingData: false,
    list: [],
    modalState: {
      isVisible: false,
      data: {},
    },
  },
  selectedUser: null,
  commentsModal: {
    visible: false,
    commentDetails: null,
  },
  rejectionCommentModal: {
    visible: false,
    rejectionDetails: null,
    name: "",
  },
});

export default eventsModuleReducer;
