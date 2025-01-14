import {
  CLEAR_LICENSE,
  EXPERT_SELECTED_LICENSE,
  GET_PAYMENT_DETAIL,
  IS_PAYMENT_DONE,
  MAIN_SELECTED_LICENSE,
  MAKE_PAYMENT,
  SET_PAYMENT_DETAIL,
  SET_PAYMENT_TYPE,
  SET_PLAN,
  SET_PLAN_MAIN,
  SET_SELECTED_LICENSE,
  SET_SUCCESS,
  SET_USER_COUNT,
} from "./types";

const intialState = {
  paymentDetail: [],
  isSuccess: false,
  isPaymentDone: false,
  expertReviewLicenseDetail: {
    selectedLicense: [],
    plan: {},
  },
  mainPaymentLicenseDetail: {
    selectedLicense: [],
    plan: {},
  },
  selectedLicense: [],
  paymentType: "",
  userCount: "",
};

const reducer = (state = intialState, { type, payload }) => {
  switch (type) {
    case GET_PAYMENT_DETAIL:
      return state;

    case SET_PAYMENT_DETAIL:
      return {
        ...state,
        paymentDetail: [...payload],
      };

    case SET_SUCCESS:
      return {
        ...state,
        isSuccess: payload,
      };

    case IS_PAYMENT_DONE:
      return {
        ...state,
        isPaymentDone: payload,
      };

    case MAKE_PAYMENT:
      return state;

    case EXPERT_SELECTED_LICENSE:
      return {
        ...state,
        expertReviewLicenseDetail: {
          ...state.expertReviewLicenseDetail,
          selectedLicense: [...payload],
        },
      };

    case SET_PLAN:
      return {
        ...state,
        expertReviewLicenseDetail: {
          ...state.expertReviewLicenseDetail,
          plan: payload,
        },
      };

    case MAIN_SELECTED_LICENSE:
      return {
        ...state,
        mainPaymentLicenseDetail: {
          ...state.mainPaymentLicenseDetail,
          selectedLicense: [...payload],
        },
      };

    case SET_PLAN_MAIN:
      return {
        ...state,
        mainPaymentLicenseDetail: {
          ...state.mainPaymentLicenseDetail,
          plan: payload,
        },
      };

    case CLEAR_LICENSE: {
      return {
        ...state,
        paymentDetail: [],
        mainPaymentLicenseDetail: {
          ...state.mainPaymentLicenseDetail,
          plan: {},
          selectedLicense: [],
        },
        expertReviewLicenseDetail: {
          ...state.expertReviewLicenseDetail,
          plan: {},
          selectedLicense: [],
        },
      };
    }

    case SET_SELECTED_LICENSE: {
      return {
        ...state,
        selectedLicense: payload,
      };
    }

    case SET_PAYMENT_TYPE: {
      return { ...state, paymentType: payload };
    }

    case SET_USER_COUNT: {
      return { ...state, userCount: payload };
    }
    default:
      return state;
  }
};

export default reducer;
