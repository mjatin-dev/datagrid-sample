import {
  CREATE_CUSTOM_CHECKLIST_FAILED,
  CREATE_CUSTOM_CHECKLIST_REQUEST,
  CREATE_CUSTOM_CHECKLIST_SUCCESS,
  FETCH_CHECKLIST_FAILED,
  FETCH_CHECKLIST_REQUEST,
  FETCH_CHECKLIST_SUCCESS,
  FETCH_LICENSES_FAILED,
  FETCH_LICENSES_REQUEST,
  FETCH_LICENSES_SUCCESS,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_FAILED,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_SUCCESS,
  SET_CHECKLIST_DETAILS,
  SET_YOUR_COMPLIANCE_CHECKLIST_DETAILS,
  UPDATE_SELECTED_LICENSES,
} from "./types";

const initialState = {
  loading: false,
  licenses: {
    data: [],
    selectedLicenses: [],
  },
  checklist: {
    currentOpenedChecklistId: "",
    data: [],
    checklistDetailsById: {},
  },
  yourCompliance: {
    currentOpenedChecklistId: "",
    data: [],
    checklistDetailsById: {},
  },
};

const otherComplianceReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_SELECTED_LICENSES:
      return {
        ...state,
        licenses: {
          ...state.licenses,
          selectedLicenses: payload,
        },
      };
    case FETCH_LICENSES_REQUEST:
      return {
        ...state,
        loading: true,
        licenses: {
          ...state.licenses,
          data: [],
        },
      };
    case FETCH_LICENSES_SUCCESS:
      return {
        ...state,
        loading: false,
        licenses: {
          ...state.licenses,
          data: payload,
        },
      };
    case FETCH_LICENSES_FAILED:
      return {
        ...state,
        loading: false,
      };
    case FETCH_CHECKLIST_REQUEST:
      return {
        ...state,
        loading: true,
        checklist: {
          ...state.checklist,
          data: [],
        },
      };
    case FETCH_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        checklist: {
          ...state.checklist,
          data: payload,
        },
      };
    case FETCH_CHECKLIST_FAILED:
      return {
        ...state,
        loading: false,
      };
    case SET_CHECKLIST_DETAILS:
      return {
        ...state,
        checklist: {
          ...state.checklist,
          checklistDetailsById: payload,
        },
      };
    case SET_YOUR_COMPLIANCE_CHECKLIST_DETAILS:
      return {
        ...state,
        yourCompliance: {
          ...state.yourCompliance,
          checklistDetailsById: payload,
        },
      };
    case CREATE_CUSTOM_CHECKLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_CUSTOM_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_CUSTOM_CHECKLIST_FAILED:
      return {
        ...state,
        loading: false,
      };
    case FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST:
      return {
        ...state,
        loading: true,
        yourCompliance: {
          ...state.yourCompliance,
          data: [],
        },
      };
    case FETCH_YOUR_COMPLIANCE_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        yourCompliance: {
          ...state.yourCompliance,
          data: payload,
        },
      };
    case FETCH_YOUR_COMPLIANCE_CHECKLIST_FAILED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
export default otherComplianceReducer;
